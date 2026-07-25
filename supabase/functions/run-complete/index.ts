import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') ?? '*';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const modes = new Set(['classic', 'es_en', 'en_es']);

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('origin');
  const responseOrigin = allowedOrigin === '*' || origin === allowedOrigin ? (origin ?? allowedOrigin) : allowedOrigin;
  return {
    'Access-Control-Allow-Origin': responseOrigin,
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  };
}

function json(request: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), 'Content-Type': 'application/json; charset=utf-8' },
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(request) });
  if (request.method !== 'POST') return json(request, { error: 'method_not_allowed' }, 405);
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error('Missing Supabase Edge Function environment variables.');
    return json(request, { error: 'service_not_configured' }, 503);
  }

  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return json(request, { error: 'unauthorized' }, 401);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json(request, { error: 'invalid_json' }, 400);
  }

  if (!payload || typeof payload !== 'object') return json(request, { error: 'invalid_payload' }, 400);
  const { runId, score, mode } = payload as Record<string, unknown>;
  if (typeof runId !== 'string' || !uuidPattern.test(runId)) return json(request, { error: 'invalid_run_id' }, 400);
  if (!Number.isInteger(score) || score < 0 || score > 250000) return json(request, { error: 'invalid_score' }, 400);
  if (typeof mode !== 'string' || !modes.has(mode)) return json(request, { error: 'invalid_mode' }, 400);

  // The anonymous JWT is verified before the service role performs the write.
  const authClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser();
  if (authError || !authData.user) return json(request, { error: 'unauthorized' }, 401);

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await adminClient.rpc('record_run_completion', {
    p_run_id: runId,
    p_player_id: authData.user.id,
    p_score: score,
    p_mode: mode,
  });

  if (error) {
    console.error('record_run_completion failed', { code: error.code, message: error.message });
    return json(request, { error: 'run_not_accepted' }, 422);
  }

  const result = Array.isArray(data) ? data[0] : data;
  return json(request, { result });
});
