# Escritorio: siguiente entrega

La versión de escritorio se habilita después de aprobar la beta web. El núcleo
Phaser y los contratos de `src/game/domain` no dependen del navegador y serán
reutilizados mediante Tauri 2.

Objetivo inicial: Windows 10/11 x64, guardado local y distribución premium.
No se iniciará Steam, compras ni actualización automática hasta disponer de
cuenta de tienda, claves de firma y una versión web validada.

## Entrada prevista

- `npm run build` genera la interfaz estática que Tauri cargará.
- Tauri tendrá permisos mínimos; no se expondrán rutas de sistema a React.
- La economía y los DLC se consultarán a Supabase con la misma API pública.
