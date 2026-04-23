# TOOLS.md

## SSH / Infra

- GCE instance principal: `openclaw-server`
- Zona GCE: `southamerica-west1-b`
- Comando preferido para acceso SSH:
  - `gcloud compute ssh openclaw-server --zone=southamerica-west1-b`

## Workspace del agente principal

- Workspace agente `main`: `~/openclaw-workspace/agents/main/`
- Archivos base del agente viven en la raíz de ese directorio
- Carpeta de avatar: `~/openclaw-workspace/agents/main/avatars/`

## Identidad visual

- Avatar principal: `avatars/tenazas.svg`
- Avatar alternativo: `avatars/tenazas.jpg`
- Nombre público del bot: `Tenazas`
- Referencia visual: Tenazas, la langosta de Homero

## Rutas útiles

- `AGENTS.md`
- `SOUL.md`
- `IDENTITY.md`
- `USER.md`
- `TOOLS.md`
- `avatars/tenazas.svg`
- `avatars/tenazas.jpg`

## Convenciones locales

- Preferir rutas relativas al workspace cuando sea posible
- Mantener los assets del agente dentro del workspace
- No guardar secretos ni credenciales en este repositorio
- Usar este archivo para notas del entorno, no para reglas operativas

## WordPress — DataMaq

- Sitio web: [datamaq.com.ar](https://datamaq.com.ar)
- Tema personalizado (repo): `https://github.com/AgustinMadygraf/wp-cursos`
- Repo clonado localmente: `~/openclaw-workspace/wp-cursos/`
- Tema activo: **`blocksy-child-datamaq`** (child theme de Blocksy, v4.0.0)
- Ruta del tema: `~/openclaw-workspace/wp-cursos/wp-content/themes/blocksy-child-datamaq/`
- Documentación: `~/openclaw-workspace/docs/WP_CURSOS_SETUP.md`

### Archivos clave del tema (a revisar para propuestas de mejora)

| Archivo | Qué contiene |
|---------|--------------|
| `style.css` | Variables de diseño, tipografía Inter, dock móvil, cards glass |
| `functions.php` | Carga modular inc/, integración Chatwoot |
| `front-page.php` | Plantilla de la home (página 205) |
| `header.php` / `footer.php` | Header y footer custom |
| `template-parts/content-hero.php` | Sección hero |
| `template-parts/content-services.php` | Servicios |
| `template-parts/content-profile.php` | Perfil técnico |
| `template-parts/content-faq.php` | FAQ |
| `template-parts/content-proceso.php` | Proceso |
| `template-parts/content-contact.php` | Contacto |
| `inc/site-data.php` | Capa de datos |
| `inc/ajax-handlers.php` | AJAX handlers |
| `inc/theme-setup.php` | Setup y assets |
| `docs/microauditorias/` | Auditorías de parity vs. SPA Vue |

## Git

- Repo del agente inicializado dentro de:
  - `~/openclaw-workspace/agents/main/`
- Antes de commit:
  - revisar archivos nuevos con `git status`
  - evitar duplicados por mayúsculas/minúsculas
