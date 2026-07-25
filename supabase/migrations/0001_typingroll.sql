-- TypingRoll v1: public content, anonymous-player progress, and server-owned economy.
-- Apply with `supabase db push`; do not run service-role credentials in the browser.

create extension if not exists pgcrypto;

create table public.content_packs (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]*$'),
  version integer not null check (version > 0),
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '',
  language text not null check (language in ('es', 'en')),
  categories text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  released_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  unique (id, version)
);

create table public.word_entries (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]*$'),
  text text not null check (char_length(text) between 2 and 48),
  normalized text not null check (normalized ~ '^[A-Z]{2,24}$'),
  language text not null check (language in ('es', 'en')),
  difficulty smallint not null check (difficulty between 1 and 5),
  category text not null check (category in (
    'animals', 'body', 'clothing', 'colors', 'food', 'home', 'nature', 'people', 'school', 'technology', 'travel'
  )),
  pack_id text not null references public.content_packs(id) on delete restrict,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_safe boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (language, normalized)
);

create table public.translation_entries (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]*$'),
  source_word_id text not null references public.word_entries(id) on delete cascade,
  target_word_id text not null references public.word_entries(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (source_word_id, target_word_id),
  check (source_word_id <> target_word_id)
);

create table public.cosmetics (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]*$'),
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '',
  kind text not null check (kind in (
    'cloud_palette', 'river_palette', 'success_trail', 'particles', 'profile_frame', 'keyboard_theme'
  )),
  rarity text not null check (rarity in ('common', 'rare', 'epic')),
  price_coins integer not null default 0 check (price_coins >= 0),
  is_free boolean not null default false,
  preview jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  check ((is_free and price_coins = 0) or not is_free)
);

create table public.seasons (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]*$'),
  name text not null check (char_length(name) between 1 and 120),
  theme text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  featured_pack_ids text[] not null default '{}',
  reward_cosmetic_ids text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  check (starts_at < ends_at)
);

create table public.player_progress (
  player_id uuid primary key references auth.users(id) on delete cascade,
  version smallint not null default 1 check (version = 1),
  display_name text not null default 'Jugador invitado' check (display_name = 'Jugador invitado'),
  coins bigint not null default 0 check (coins >= 0),
  high_score integer not null default 0 check (high_score >= 0),
  owned_cosmetic_ids text[] not null default '{}',
  selected_cosmetic_ids jsonb not null default '{}'::jsonb,
  achievement_ids text[] not null default '{}',
  claimed_daily_challenge_ids text[] not null default '{}',
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.run_completions (
  id uuid primary key,
  player_id uuid not null references auth.users(id) on delete cascade,
  mode text not null check (mode in ('classic', 'es_en', 'en_es')),
  score integer not null check (score between 0 and 250000),
  reward_coins integer not null check (reward_coins between 0 and 75),
  completed_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create index run_completions_player_id_completed_at_idx
  on public.run_completions (player_id, completed_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger player_progress_set_updated_at
before update on public.player_progress
for each row execute function public.set_updated_at();

-- All editable economy values are server-owned. Anonymous users can read only
-- their own progress; the Edge Function below writes via a privileged RPC.
alter table public.content_packs enable row level security;
alter table public.word_entries enable row level security;
alter table public.translation_entries enable row level security;
alter table public.cosmetics enable row level security;
alter table public.seasons enable row level security;
alter table public.player_progress enable row level security;
alter table public.run_completions enable row level security;

create policy "published packs are readable"
on public.content_packs for select
using (status = 'published');

create policy "published words are readable"
on public.word_entries for select
using (status = 'published' and is_safe = true);

create policy "published translations are readable"
on public.translation_entries for select
using (status = 'published');

create policy "published cosmetics are readable"
on public.cosmetics for select
using (status = 'published');

create policy "published seasons are readable"
on public.seasons for select
using (status = 'published');

create policy "players read only their own progress"
on public.player_progress for select to authenticated
using (player_id = auth.uid());

-- No client policy exists for player_progress writes or run_completions. The
-- service role bypasses RLS only inside the server-side Edge Function.

create or replace function public.record_run_completion(
  p_run_id uuid,
  p_player_id uuid,
  p_score integer,
  p_mode text
)
returns table (reward_coins integer, total_coins bigint, high_score integer, duplicate boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_run public.run_completions%rowtype;
  earned integer;
  next_coins bigint;
  next_high_score integer;
begin
  if p_player_id is null then
    raise exception 'player_id is required' using errcode = '22023';
  end if;
  if p_score < 0 or p_score > 250000 then
    raise exception 'score outside accepted range' using errcode = '22023';
  end if;
  if p_mode not in ('classic', 'es_en', 'en_es') then
    raise exception 'invalid game mode' using errcode = '22023';
  end if;

  -- Serializing per run ID makes retries and concurrent network requests safe.
  perform pg_advisory_xact_lock(hashtext(p_run_id::text));
  select * into existing_run from public.run_completions where id = p_run_id;
  if found then
    if existing_run.player_id <> p_player_id then
      raise exception 'run_id already belongs to a different player' using errcode = '42501';
    end if;
    select coins, player_progress.high_score into next_coins, next_high_score
    from public.player_progress where player_id = p_player_id;
    return query select existing_run.reward_coins, coalesce(next_coins, 0), coalesce(next_high_score, 0), true;
    return;
  end if;

  earned := least(75, greatest(5, 5 + floor(p_score / 250.0)::integer));
  insert into public.player_progress (player_id, coins, high_score)
  values (p_player_id, earned, p_score)
  on conflict (player_id) do update set
    coins = public.player_progress.coins + excluded.coins,
    high_score = greatest(public.player_progress.high_score, excluded.high_score)
  returning coins, player_progress.high_score into next_coins, next_high_score;

  insert into public.run_completions (id, player_id, mode, score, reward_coins)
  values (p_run_id, p_player_id, p_mode, p_score, earned);

  return query select earned, next_coins, next_high_score, false;
end;
$$;

revoke all on function public.record_run_completion(uuid, uuid, integer, text) from public;
grant execute on function public.record_run_completion(uuid, uuid, integer, text) to service_role;
