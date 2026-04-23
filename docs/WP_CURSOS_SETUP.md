# WordPress — Tema DataMaq / wp-cursos

## Estado actual

**Pendiente de acceso.** Se intentó clonar el repositorio del tema WordPress para que OpenClaw tenga contexto del código fuente del sitio, pero el token GitHub configurado en el MCP (`datamaq-automation`) no tiene visibilidad sobre `https://github.com/AgustinMadygraf/wp-cursos`.

## Diagnóstico

- El repo devuelve `404 Not Found` vía API REST de GitHub usando el token actual.
- Esto ocurre cuando el repo es **privado** y la cuenta que posee el token no es colaboradora.
- El token activo pertenece a `datamaq-automation`.
- La identidad Git local es `AgustinMadygraf`, pero no hay token personal de esa cuenta configurado en el entorno.

## Soluciones posibles (elegir una)

### Opción A — Invitar al bot (recomendada)
1. Desde la cuenta `AgustinMadygraf` en GitHub, ir a `https://github.com/AgustinMadygraf/wp-cursos/settings/access`.
2. Agregar como colaborador a la cuenta **`datamaq-automation`**.
3. Aceptar la invitación desde la cuenta bot (o hacerla pública la invitación si es posible).
4. Reintentar la clonación en este VPS.

### Opción B — Token personal dedicado
1. Generar un **Fine-grained Personal Access Token** desde la cuenta `AgustinMadygraf` con scope de lectura sobre `wp-cursos`.
2. Agregar un segundo servidor MCP `github-agustin` en `~/.kimi/mcp.json` y `~/.openclaw/openclaw.json` usando ese token.
3. Reintentar la clonación.

### Opción C — Repo público temporal
1. Hacer público el repo `wp-cursos` (solo si no contiene secrets, credenciales de DB ni claves API).
2. Clonar directamente sin token.
3. Volver a privado una vez clonado (aunque el historial quedará en el VPS local).

### Opción D — Sincronización desde el servidor de producción
Si el tema ya está deployado en el VPS de producción (AlmaLinux) donde corre WordPress:
1. Configurar SSH key desde este VPS (`openclaw-server`) hacia el servidor de producción.
2. Hacer `rsync` del directorio del tema (ej: `/var/www/html/wp-content/themes/wp-cursos/` o similar).
3. Esto evita depender de GitHub por completo.

## Ubicación propuesta una vez resuelto

```
/home/agustin/openclaw-workspace/wp-cursos/
```

Con esa ruta dentro de `/home/agustin`, el MCP `filesystem` ya puede leer todos los archivos (`content.php`, `functions.php`, `style.css`, etc.) sin instalar ningún MCP adicional.

## Próximo paso

Indicar cuál opción prefiere para proceder con la clonación y configuración del contexto para Tenazas.
