# Supabase: TypingRoll

Esta carpeta define la capa remota opcional. La aplicación sigue funcionando sin ella mediante `LocalContentClient`, por lo que una web de desarrollo no expone ninguna clave ni bloquea una partida por falta de credenciales.

## Qué protege el esquema

- Los packs, palabras, traducciones, cosméticos y temporadas publicados se pueden leer públicamente; las filas en borrador no.
- Cada perfil pertenece a un usuario anónimo de Supabase y solo puede leerse con su propio JWT.
- Monedas, récord y finalizaciones no se pueden escribir desde el navegador. La función `run-complete` verifica el JWT y llama a una RPC con clave de servicio solo en el servidor.
- `run_id` es un UUID por partida. La RPC usa un bloqueo transaccional y una clave primaria para que un reintento de red no entregue monedas dos veces.

## Preparación del proyecto

1. Crea un proyecto de Supabase y activa **Anonymous sign-ins** en Authentication.
2. Para producción, activa CAPTCHA con Cloudflare Turnstile en Anonymous sign-ins y registra el dominio web. No desactives la limitación de tasa predeterminada.
3. Enlaza este repositorio y aplica el esquema:

   ```powershell
   supabase link --project-ref TU_PROJECT_REF
   supabase db push
   supabase functions deploy run-complete
   ```

4. En los secretos de la función configura `ALLOWED_ORIGIN` con la URL exacta de la web pública. Supabase proporciona `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` al entorno de la función; la última solo puede existir allí.
5. El futuro cliente remoto podrá usar únicamente `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Nunca se debe crear una variable `VITE_` para una service-role key.

## Contrato de `run-complete`

Se invoca con `POST /functions/v1/run-complete`, un encabezado `Authorization: Bearer <access_token>` de una sesión anónima y este cuerpo:

```json
{
  "runId": "550e8400-e29b-41d4-a716-446655440000",
  "score": 1250,
  "mode": "classic"
}
```

La respuesta contiene `reward_coins`, `total_coins`, `high_score` y `duplicate`. El mismo `runId` es seguro de reenviar: devuelve el resultado original con `duplicate: true` y no vuelve a sumar monedas.

## Publicar contenido

Antes de importar un pack, ejecuta desde la raíz:

```powershell
node scripts/validate-content.mjs
```

El catálogo de `src/content/catalog.ts` es el fallback curado y la muestra de formato para la primera integración. Antes de lanzamiento comercial se debe ampliar y revisar editorialmente a al menos 1.000 palabras españolas y 500 pares de traducción, conservar el resultado del validador en CI y cargar solo filas con `status = 'published'` e `is_safe = true`.

No se permite contenido generado durante una partida. La IA, si se usa, solo puede proponer borradores que una persona revise y publique después.
