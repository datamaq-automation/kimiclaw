# Auditoría del Repositorio wp-cursos

## Contexto

El repo `wp-cursos` es una instalación completa de WordPress que contiene el tema activo `blocksy-child-datamaq` y mu-plugins personalizados. Se clonó localmente para que OpenClaw tenga contexto del código fuente del sitio DataMaq.

Este documento responde dos preguntas:
1. ¿Qué archivos deberían estar en `.gitignore` y no aportan al control de versiones?
2. ¿Es conveniente hardcodear el contenido en PHP (estado actual) o consultar la base de datos / API de WordPress?

---

## ✅ Certezas

| # | Certeza |
|---|---------|
| 1 | El repo ya tiene un `.gitignore` funcional que excluye `wp-config.php`, `wp-content/uploads/`, `wp-content/cache/`, plugins de terceros y themes de terceros (excepto `blocksy-child-datamaq`). |
| 2 | **El contenido visible de la home está 100% hardcodeado** en `wp-content/themes/blocksy-child-datamaq/inc/site-data.php` (array PHP con brand, hero, services, process, profile, faq, contact). No hay `get_post()`, `WP_Query` ni llamadas a la DB para renderizar la home. |
| 3 | El formulario de contacto tiene **doble vía**: (a) JavaScript frontend que redirige a WhatsApp, y (b) handler AJAX (`ajax-handlers.php`) que envía email vía `wp_mail()` y dispara webhook a n8n. |
| 4 | Existen **archivos .bak en `mu-plugins/`** que están versionados y no deberían estar: `datamaq-spanish-overrides.php.bak.20260416-item-links` y `datamaq-spanish-overrides.php.bak.20260417-avatar-fix`. |
| 5 | `wp-config.example.php` contiene un **secret hardcodeado real**: `WP_CACHE_KEY_SALT` (línea 60). Aunque sea el archivo de ejemplo, expone un valor sensible. |
| 6 | El tema incluye **archivos binarios versionados**: `assets/media/tecnico-a-cargo.webp` (42 KB) y varios `.svg`. |
| 7 | El repo incluye **archivos del core de WordPress** que no son custom code: `license.txt`, `readme.html`, `favicon.ico`, `wp-admin/`, `wp-includes/`, `wp-*.php`. |
| 8 | La home es una **one-page estática**; el contenido no cambia frecuentemente y está pensado como "brochure digital". |
| 9 | El servidor de producción tiene **wp-cli disponible** (documentado en `VUE_TO_WP_CERTEZAS.md`). |
| 10 | El sitio usa **mu-plugins** para inyectar CSS global, el dock móvil, redirecciones legacy y overrides de LearnPress. |

---

## ❓ Dudas

| # | Duda | Impacto |
|---|------|---------|
| 1 | **¿El `wp-config.php` de producción comparte el mismo `WP_CACHE_KEY_SALT` que el ejemplo?** Si es así, el secret está comprometido al estar en Git (aunque sea en `.example`). | Seguridad. Requiere rotar el salt. |
| 2 | **¿Quién edita el contenido del sitio?** ¿Solo Agustín (dev) o también alguien del equipo comercial/operativo usa el admin de WordPress? | Define si el hardcodeo es aceptable o si se necesita CMS. |
| 3 | **¿El sitio tiene ACF (Advanced Custom Fields) o Custom Post Types configurados?** No se detectaron en el tema, pero podrían existir en la DB de producción. | Define la viabilidad de migrar el array `site-data.php` a campos de ACF. |
| 4 | **¿Se planea multi-idioma o más páginas con esta misma estructura?** | Si sí, el hardcodeo no escala. |
| 5 | **¿Los assets `.webp` y `.svg` son generados manualmente o por un pipeline?** Si son manuales, versionarlos tiene sentido; si son outputs de Figma/IA, quizás convenga una carpeta `assets/src/` y `assets/dist/`. | Limpieza del repo. |
| 6 | **¿La "fuenta de verdad" del contenido es este repo Git o la base de datos de producción?** Si un editor cambia algo en wp-admin, el repo queda desactualizado. | Flujo de trabajo y riesgo de pérdida de datos. |

---

## 🔍 Análisis — ¿Qué falta en `.gitignore`?

### Crítico (seguridad)

```gitignore
# Secrets que escaparon al repo
wp-config.example.php          # Tiene WP_CACHE_KEY_SALT real hardcodeado
```
> Nota: idealmente `wp-config.example.php` debería tener valores dummy 100% genéricos.

### Limpieza (no aportan al versionado)

```gitignore
# Backups de mu-plugins
wp-content/mu-plugins/*.bak
wp-content/mu-plugins/*.bak-*

# Archivos del core de WordPress (reinstalables vía wp-cli)
# Si el objetivo del repo es versionar solo custom code:
wp-admin/
wp-includes/
wp-*.php
license.txt
readme.html
favicon.ico
xmlrpc.php

# Assets binarios grandes (opcional, depende de estrategia)
# Si se versionan, considerar Git LFS:
# *.webp
```

### Recomendación sobre el scope del repo

El repo actualmente pesa lo que pesa WordPress completo (~3000 archivos del core). Si el objetivo es solo versionar el **tema custom + mu-plugins + docs**, el repo debería reducirse a:

```
wp-content/themes/blocksy-child-datamaq/
wp-content/mu-plugins/
```

Todo lo demás (core WP, plugins de terceros, uploads) es reinstalable vía `wp core download` + `wp plugin install`.

**Alternativa más simple sin reestructurar el repo:** agregar las exclusiones de arriba al `.gitignore` y borrar los archivos ya trackeados con `git rm --cached`.

---

## ⚖️ Análisis — ¿Hardcodear en PHP vs DB vs API?

### Estado actual: Array hardcodeado en `site-data.php`

```php
function get_datamaq_site_data() {
    return [
        'brand' => [...],
        'hero' => [...],
        'services' => [...],
        // etc
    ];
}
```

**Ventajas actuales:**
- Cero queries a la base de datos para cargar la home (máxima velocidad).
- El contenido viaja con el código; deploys atómicos (Git = fuente de verdad).
- No depende de plugins de terceros (ACF, etc.).
- Funciona incluso si la DB está caída (modo "estático").

**Desventajas actuales:**
- Para cambiar una coma en el hero hay que editar PHP, commitear y deployar.
- Un usuario no-técnico no puede editar contenido.
- El "contenido" no está en el CMS; WordPress se reduce a un "motor de templates".
- Riesgo de desincronización si alguien edita algo en wp-admin pensando que persiste.

### Opción A: Mantener hardcodeado (recomendado para este caso específico)

**Cuándo aplica:**
- El sitio es una one-page corporativa con contenido estable.
- El editor del contenido es el mismo desarrollador (Agustín).
- La prioridad es velocidad de carga y simplicidad operativa.
- No hay equipo de marketing que necesite editar textos frecuentemente.

**Mejoras sugeridas si se mantiene:**
1. Separar `site-data.php` en archivos por sección (`data-brand.php`, `data-hero.php`, etc.) para reducir conflictos.
2. Agregar un mecanismo de "override" desde la DB: si existe un post con slug `datamaq-hero`, usarlo; si no, fallback al array.
3. Documentar explícitamente en `AGENTS.md` del workspace que el contenido no se edita por wp-admin.

### Opción B: Migrar contenido a Custom Post Types + campos nativos de WordPress

**Implementación:**
- Crear un CPT `dm_sections` con taxonomía `section_type` (hero, services, faq...).
- Migrar el array de `site-data.php` a posts de ese CPT.
- Reemplazar `get_datamaq_site_data()` por `get_posts(['post_type' => 'dm_sections'])`.

**Ventajas:**
- WordPress cumple su rol de CMS.
- Editable desde wp-admin sin tocar código.
- Escalable a multi-idioma (WPML/Polylang).

**Desventajas:**
- Requiere migración inicial y testing.
- Más queries a la DB (mitigable con object cache / transientes).
- Aumenta la complejidad del tema.

### Opción C: Consultar vía API REST de WordPress

**Implementación:**
- Exponer el contenido vía endpoints REST custom (`/wp-json/datamaq/v1/site-data`).
- Consumir ese endpoint desde el frontend (JS) o desde otro servicio.

**Ventajas:**
- Desacopla completamente el contenido de la presentación.
- Permite headless/decoupled si en el futuro se reemplaza el tema.

**Desventajas:**
- Overkill para una one-page estática.
- Agrega latencia de red (HTTP request extra).
- Rompe el SEO si el renderizado depende 100% de JS.
- **No recomendado** para este caso.

### Opción D: Híbrido (recomendación estratégica)

**Implementación:**
- **Contenido estático y estable** (hero principal, brand, proceso de 4 pasos): **se mantiene hardcodeado** en `site-data.php`.
- **Contenido dinámico o frecuente** (FAQ, servicios, testimonios, casos de éxito): **se mueve a la DB** (páginas, posts o ACF).
- Los template parts usan `get_datamaq_site_data()` como fallback y `get_post_meta()` / `get_posts()` como fuente primaria.

**Ejemplo de híbrido en `content-faq.php`:**
```php
$faq_custom = get_posts(['post_type' => 'dm_faq', 'numberposts' => -1]);
if ($faq_custom) {
    // usar posts de la DB
} else {
    $faq = get_datamaq_site_data()['faq']; // fallback hardcodeado
}
```

---

## 🎯 Recomendaciones finales

### Inmediatas (hoy)

1. **Rotar el `WP_CACHE_KEY_SALT`** de producción si coincide con el valor de `wp-config.example.php`.
2. **Agregar al `.gitignore` de `wp-cursos`:**
   ```
   wp-content/mu-plugins/*.bak*
   wp-config.example.php          # o limpiar el salt
   ```
3. **Borrar los `.bak` ya trackeados** del repo:
   ```bash
   git rm --cached wp-content/mu-plugins/*.bak*
   ```

### Corto plazo (esta semana)

4. **Decidir la fuente de verdad del contenido**:
   - Si sos el único editor → **mantené el array PHP** (Opción A), pero separalo por secciones.
   - Si alguien más necesita editar texto → **evaluá Opción D (híbrido)** empezando por FAQ y Servicios.

5. **Documentar en el workspace** que el contenido de la home no se edita por wp-admin, para que Tenazas no sugiera cambios en la DB pensando que se reflejan.

### Mediano plazo

6. Si el sitio crece a múltiples páginas o idiomas, **migrar todo a CPT/ACF** (Opción B) y deprecar `site-data.php`.
7. Evaluar **Git LFS** para los assets `.webp` si crecen en tamaño o cantidad.

---

## Estado del repo wp-cursos

- **Ruta local**: `~/openclaw-workspace/wp-cursos/`
- **Tema custom**: `wp-content/themes/blocksy-child-datamaq/`
- **mu-plugins**: `wp-content/mu-plugins/`
- **Secrets expuestos**: `WP_CACHE_KEY_SALT` en `wp-config.example.php`
- **Backups sueltos**: 2 archivos `.bak` en `mu-plugins/`
