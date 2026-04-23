# Prompt de contexto para Kimi Code (VPS AlmaLinux)

## Tu rol y contexto

Sos Kimi Code, instalado en el VPS AlmaLinux 8.10 de DataMaq (stack productivo: SuiteCRM, n8n, Chatwoot, WordPress). 

En el otro VPS (Debian 12, `openclaw-server`) corre OpenClaw/KimiClaw con el agente "Tenazas 🦞", un CEO virtual. Tenazas ya audita el código fuente del sitio WordPress de DataMaq, que vive en **este** VPS (AlmaLinux). 

Este documento te pone al día de todo lo que descubrió Tenazas para que trabajés coordinado con él.

---

## 🗺️ Infraestructura cruzada (2 VPS)

| VPS | OS | Rol | Qué corre ahí |
|-----|-----|-----|---------------|
| `openclaw-server` | Debian 12 | Gateway AI + dev | OpenClaw gateway, KimiClaw bridge, Vertex AI proxy, MCP filesystem, MCP GitHub |
| VPS AlmaLinux | AlmaLinux 8.10 | Productivo | WordPress (`datamaq.com.ar`), SuiteCRM, n8n, Chatwoot |

- **WordPress en producción**: `/home/datamaq/public_html/cursos` (según documentación interna).
- **Repo Git del WP**: `https://github.com/AgustinMadygraf/wp-cursos` (privado, cuenta `datamaq-automation` ya es colaboradora).
- **Tema activo**: `blocksy-child-datamaq` (child theme de Blocksy, v4.0.0).

---

## ✅ Certezas que ya están validadas

### Sobre el repo wp-cursos
1. Es una **instalación completa de WordPress** clonada en `openclaw-server` bajo `~/openclaw-workspace/wp-cursos/`.
2. El tema custom está en `wp-content/themes/blocksy-child-datamaq/` y contiene:
   - `style.css` — variables de diseño DataMaq, tipografía Inter, dock móvil, cards glass.
   - `functions.php` — carga modular de `inc/site-data.php`, `inc/ajax-handlers.php`, `inc/theme-setup.php`.
   - `front-page.php` — plantilla de la home (página 205, slug `datamaq-home`).
   - `template-parts/` — fragments: `content-hero.php`, `content-services.php`, `content-profile.php`, `content-proceso.php`, `content-faq.php`, `content-contact.php`.
   - `page-contact.php`, `page-gracias.php` — páginas específicas.
   - `inc/site-data.php` — **array PHP gigante con TODO el contenido de la home** (brand, hero, services, process, profile, faq, contactPage). No hay consultas a la DB.
3. **El contenido de la home está 100% hardcodeado en PHP**. No usa `WP_Query`, `get_post()` ni Custom Post Types. WordPress funciona como "motor de templates", no como CMS de contenido para la home.
4. El formulario de contacto tiene **doble vía**:
   - **Frontend JS** (en `content-contact.php`): redirige a WhatsApp (`wa.me/5491156297160`) con mensaje pre-armado.
   - **Backend AJAX** (`inc/ajax-handlers.php`): envía email a `info@datamaq.com.ar` y dispara webhook a `https://n8n.datamaq.com.ar/webhook/contact-form`.
5. Hay **mu-plugins** custom en `wp-content/mu-plugins/`:
   - `datamaq-design-system.php` — inyecta CSS global con variables del design system.
   - `datamaq-mobile-dock.php` — renderiza el dock flotante móvil.
   - `datamaq-learnpress-item-links.php` — overrides de LearnPress.
   - `datamaq-legacy-route-redirects.php` — redirecciones legacy.
   - `datamaq-disable-comments.php` — desactiva comentarios.
   - `datamaq-spanish-overrides.php` — ajustes de localización.
6. El sitio usa **Chatwoot** (script inyectado en `functions.php`) con widget en `chatwoot.datamaq.com.ar`.
7. El `.gitignore` del repo ya excluye `wp-config.php`, `uploads/`, `cache/`, plugins de terceros y themes de terceros (excepto `blocksy-child-datamaq`).

### Sobre el design system
8. Paleta: fondo `#0c092f`, superficie `#1a1c3d`, acento naranja `#ff6a00` / `#ff9a4d`.
9. Tipografía: Inter (400, 700, 800, 900).
10. Mobile dock: implementado en CSS puro (`c-parity-dock` / `c-home-dock`).
11. La home replica la narrativa de una SPA Vue anterior (IoT, energía, producción, instalación, análisis, capacitación).
12. Existe documentación de **microauditorías** en `docs/microauditorias/` comparando la home WP contra la SPA Vue.

### Sobre la base de datos
13. No se ha detectado uso de la base de datos MySQL para el contenido de la home. Todo vive en `site-data.php`.
14. El servidor de producción tiene **wp-cli disponible**.
15. WordPress tiene **mu-plugins** activos que operan sobre la instalación existente.

---

## ❓ Dudas abiertas que necesitás resolver o validar

### Seguridad
1. **¿El `WP_CACHE_KEY_SALT` de producción coincide con el valor hardcodeado en `wp-config.example.php` (línea 60)?** El repo expone ese secret. Si es el mismo, hay que rotarlo urgente en el servidor.
2. **¿Hay credenciales de DB, API keys o tokens hardcodeados en otros archivos del servidor que no estén en el repo?** Por ejemplo: `wp-config.php` en producción, archivos de n8n, credenciales de Chatwoot, etc.

### Arquitectura de datos
3. **¿La base de datos MySQL de producción tiene ACF (Advanced Custom Fields) instalado o Custom Post Types configurados?** El tema no los referencia, pero podrían existir en la DB.
4. **¿Hay plugins activos en producción que no estén reflejados en el repo?** (Plugins que se instalaron por wp-admin y nunca se versionaron.)
5. **¿El contenido de la home en la DB (página 205) tiene algún valor real o es un "contenedor vacío" que solo sirve para que WordPress asigne la front page?** En el repo, la página 205 no tiene contenido enriquecido; todo se inyecta desde `site-data.php`.

### Flujo de trabajo
6. **¿Quién edita el contenido del sitio?** ¿Solo Agustín (dev) o alguien del equipo comercial usa wp-admin? Eso define si el hardcodeo es aceptable a largo plazo.
7. **¿La "fuente de verdad" del contenido es el repo Git o la base de datos?** Si un editor cambia algo en wp-admin, el repo queda desactualizado. Hay que definir cuál manda.
8. **¿Se planea multi-idioma, más páginas internas, o hacer el sitio headless en el futuro?**

### Assets y deploy
9. **¿Los archivos `.webp` y `.svg` en `assets/media/` son generados manualmente o salen de un pipeline (Figma, build, IA)?** Si son outputs de un pipeline, quizás deberían ignorarse y regenerarse en deploy.
10. **¿El deploy a producción se hace vía Git pull, rsync, FTP o panel de hosting?**

### Integraciones
11. **¿El webhook a n8n (`https://n8n.datamaq.com.ar/webhook/contact-form`) está activo y procesando leads correctamente?**
12. **¿El endpoint de AJAX (`wp_ajax_submit_contact`) tiene rate limiting o protección contra spam además de Cloudflare Turnstile?**
13. **¿El email `info@datamaq.com.ar` recibe los formularios?** ¿No va a spam?

---

## 🎯 Qué se espera de vos (Kimi Code en AlmaLinux)

1. **Validar la seguridad**: revisá `wp-config.php` en producción, comparalo con `wp-config.example.php` del repo y rotá secrets si es necesario.
2. **Auditar la DB**: verificá si hay ACF, CPTs, campos personalizados o plugins activos que el tema no referencie.
3. **Complementar la auditoría de Tenazas**: él tiene el contexto del código; vos tenés acceso al servidor productivo y a la DB. Cruzá ambas fuentes.
4. **Revisar integraciones**: confirmá que n8n, Chatwoot y el email del formulario funcionan.
5. **Documentar el estado real de producción**: si encontrás diferencias entre el repo y el servidor, documentalas para que Tenazas las tenga en cuenta al proponer mejoras.

---

## 📂 Rutas clave para referenciar

En `openclaw-server` (Debian 12, accesible por Tenazas):
- Repo clonado: `~/openclaw-workspace/wp-cursos/`
- Tema custom: `~/openclaw-workspace/wp-cursos/wp-content/themes/blocksy-child-datamaq/`
- Documentación: `~/openclaw-workspace/docs/WP_REPO_AUDIT.md`
- Documentación setup: `~/openclaw-workspace/docs/WP_CURSOS_SETUP.md`

En este VPS (AlmaLinux 8.10, accesible por vos):
- WordPress en producción: `/home/datamaq/public_html/cursos` (según documentación interna)
- wp-cli: disponible

---

## 🧠 Regla de oro

> **Tenazas propone mejoras estratégicas y de código; vos validás si esas mejoras son viables en el servidor productivo y en la DB real.**

Trabajad coordinados: si Tenazas sugiere "mover el contenido de site-data.php a Custom Post Types", vos verificás si la DB ya tiene la estructura necesaria o si hay que crearla.

---

*Generado por Tenazas 🦞 (OpenClaw) en openclaw-server. Fecha: 2026-04-23.*
