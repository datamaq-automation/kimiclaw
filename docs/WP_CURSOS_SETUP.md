# WordPress — Tema DataMaq / wp-cursos

## Estado actual

✅ **Clonado correctamente.** El repositorio privado `https://github.com/AgustinMadygraf/wp-cursos` está disponible localmente en:

```
/home/agustin/openclaw-workspace/wp-cursos/
```

> Nota: `wp-cursos/` está en `.gitignore` del workspace para evitar commitear la instalación completa de WordPress.

---

## Estructura del repo

El repo contiene una **instalación completa de WordPress** (core, wp-admin, wp-includes, wp-content). El tema activo y personalizado es un child theme de Blocksy.

### Tema relevante: `blocksy-child-datamaq`

Ruta: `wp-cursos/wp-content/themes/blocksy-child-datamaq/`

| Archivo | Propósito |
|---------|-----------|
| `style.css` | Variables de diseño DataMaq, tipografía, dock móvil, cards glass |
| `functions.php` | Carga modular: site-data, ajax-handlers, theme-setup; integración Chatwoot |
| `front-page.php` | Plantilla de la home (página 205) |
| `header.php` | Header personalizado |
| `footer.php` | Footer personalizado |
| `page-contact.php` | Plantilla de página de contacto |
| `page-gracias.php` | Plantilla de página de gracias |
| `inc/site-data.php` | Capa de datos del sitio |
| `inc/ajax-handlers.php` | Lógica de AJAX |
| `inc/theme-setup.php` | Setup de assets y configuración del tema |
| `template-parts/content-hero.php` | Sección hero |
| `template-parts/content-services.php` | Sección servicios |
| `template-parts/content-profile.php` | Sección perfil técnico |
| `template-parts/content-proceso.php` | Sección proceso |
| `template-parts/content-faq.php` | Sección FAQ |
| `template-parts/content-contact.php` | Sección contacto |
| `template-parts/content-contact-header.php` | Header de contacto |
| `assets/css/tailwind-dist.css` | Distribución Tailwind |
| `assets/css/learnpress-overrides.css` | Overrides de LearnPress |
| `docs/microauditorias/` | Documentación de parity visual vs. la SPA Vue anterior |

---

## Contexto para el agente

- **Tema padre**: Blocksy
- **Versión del child**: 4.0.0
- **Autor**: Agustin Madygraf
- **Sitio en producción**: `datamaq.com.ar` (home = página 205, slug `datamaq-home`)
- **Chatwoot**: Integrado vía script en footer (`chatwoot.datamaq.com.ar`)
- **Paleta**: fondo `#0c092f`, superficie `#1a1c3d`, acento naranja `#ff9a4d` / `#ff6a00`
- **Tipografía**: Inter
- **Dock móvil**: implementado en CSS puro (`c-parity-dock`)

---

## Cómo usa el agente este recurso

El MCP `filesystem` ya puede leer cualquier archivo dentro de `wp-cursos/` porque la ruta está bajo `/home/agustin`.

Ejemplos de uso:
- Revisar `style.css` para proponer ajustes de diseño o accesibilidad.
- Revisar `front-page.php` y `template-parts/` para sugerir optimizaciones de estructura o SEO.
- Revisar `functions.php` e `inc/` para proponer mejoras de rendimiento o seguridad.
- Revisar `docs/microauditorias/` para entender qué parity visual ya fue auditada y qué falta.

---

## Sincronización con producción

Este repo es una copia estática. Si el sitio en producción (VPS AlmaLinux, `/home/datamaq/public_html/cursos`) se modifica directamente sin pasar por Git, puede quedar desfasado.

Para mantenerlo actualizado:
```bash
cd /home/agustin/openclaw-workspace/wp-cursos
git pull origin main
```

O, si la fuente de verdad es el servidor de producción, usar `rsync` desde el VPS AlmaLinux hacia esta ruta.
