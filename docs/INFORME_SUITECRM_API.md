# Informe: Estado de integración SuiteCRM ↔ KimiClaw

**Fecha**: 2026-04-23
**De**: Agustín / Tenazas (KimiClaw en VM openclaw-server)
**Para**: Kimi Code (instalado en VPS AlmaLinux de DataMaq)
**Asunto**: Investigación de API REST de SuiteCRM para habilitar conector MCP

---

## 1. Contexto de la arquitectura

### VPS actual (openclaw-server — Debian 12)
- **Propósito**: Infraestructura de agentes AI (KimiClaw / OpenClaw)
- **Agente principal**: Tenazas 🦞 (CEO virtual de DataMaq)
- **MCPs activos**: `filesystem`, `github`
- **Modelo**: `gemini-2.5-flash` vía Google Vertex AI proxy local
- **Canales**: Kimi bridge + Telegram

### VPS externo (AlmaLinux 8.10 — RHEL/CentOS)
- **Propósito**: Stack productivo de DataMaq (hosting, CRM, automatización)
- **Sistemas activos**:
  - **SuiteCRM 7.15.1** (`crm.datamaq.com.ar`) — CRM principal
  - **n8n 2.13.4** (`n8n.datamaq.com.ar`) — Workflows
  - **Chatwoot** (`chatwoot.datamaq.com.ar`) — Chat en vivo
  - **Listmonk** — Newsletter
  - **API FastAPI** (`api.datamaq.com.ar`) — Proyecto truncado, NO está en producción
  - **Moodle** — Cursos/capacitación

### Objetivo estratégico
Conectar al CEO virtual (Tenazas) con los **datos comerciales reales** de DataMaq que viven en el VPS AlmaLinux, sin depender de la API FastAPI truncada.

El sistema con más valor para un CEO virtual es **SuiteCRM**, ya que contiene:
- Cuentas/Clientes (`Accounts`)
- Contactos (`Contacts`)
- Oportunidades (`Opportunities`)
- Cotizaciones (`Quotes` / `AOS_Quotes`)
- Llamadas/Reuniones (`Calls`, `Meetings`)
- Notas (`Notes`)

---

## 2. Petición de información a Kimi Code

Kimi Code está instalado en el VPS AlmaLinux (donde reside SuiteCRM). Se solicita que investigue y documente lo siguiente:

### 2.1 Verificación de API REST en SuiteCRM

```
¿SuiteCRM tiene habilitada la API REST v4.1 / v8?
¿Cuál es la URL base de la API? (ej: https://crm.datamaq.com.ar/Api/V8/)
¿Requiere autenticación OAuth2, Basic Auth o token de API?
¿Existe un usuario de API dedicado o se usa un usuario existente?
```

### 2.2 Endpoints críticos para el CEO virtual

Documentar los endpoints disponibles para estas entidades:

| Entidad | Endpoint esperado | Prioridad |
|---------|-------------------|-----------|
| Accounts (Clientes) | `GET /Api/V8/module/Accounts` | **Alta** |
| Contacts | `GET /Api/V8/module/Contacts` | **Alta** |
| Opportunities | `GET /Api/V8/module/Opportunities` | **Alta** |
| AOS_Quotes (Cotizaciones) | `GET /Api/V8/module/AOS_Quotes` | **Alta** |
| Calls | `GET /Api/V8/module/Calls` | Media |
| Meetings | `GET /Api/V8/module/Meetings` | Media |
| Notes | `GET /Api/V8/module/Notes` | Media |
| Tasks | `GET /Api/V8/module/Tasks` | Baja |

### 2.3 Capacidades de filtrado y búsqueda

```
¿Se pueden aplicar filtros por campo? (ej: Opportunities donde status = 'Pending')
¿Se pueden ordenar resultados? (ej: por date_entered desc)
¿Hay paginación? ¿Cuál es el límite de registros por request?
¿Se puede hacer búsqueda global (cross-module search)?
```

### 2.4 Seguridad y rate limits

```
¿Hay límites de requests por minuto/hora?
¿Qué pasa si se excede el límite? (HTTP 429, bloqueo temporal)
¿Los tokens/cookies expiran? ¿Con qué frecuencia?
```

### 2.5 Alternativas si la API REST no está habilitada

Si la API REST v8 no está disponible o es inaccesible, investigar:

```
¿SuiteCRM tiene habilitada la API SOAP v4.1?
¿Existe algún plugin/módulo que exponga una API REST adicional?
¿Se puede habilitar la API v8 desde el panel de administración de SuiteCRM?
¿Hay alguna tabla o vista de base de datos que sea más práctica de consultar directamente?
```

---

## 3. Formato de entrega esperado

Kimi Code debería entregar un documento en formato Markdown con:

1. **Estado de la API**: Habilitada / No habilitada / Parcialmente habilitada
2. **URL base confirmada** de la API
3. **Método de autenticación** requerido
4. **Tabla de endpoints probados**: endpoint, método HTTP, si funciona, ejemplo de response (anonymized)
5. **Ejemplo de curl** funcional para cada endpoint crítico
6. **Limitaciones encontradas** (rate limits, campos faltantes, errores comunes)
7. **Recomendación**: ¿Es viable usar `fetch` (HTTP directo) o conviene construir un MCP custom?

---

## 4. Notas adicionales

- **No modificar nada en producción** sin autorización explícita.
- **No crear usuarios de API** sin confirmar con Agustín.
- **No exponer credenciales** en el documento; usar placeholders.
- Si la API no está habilitada, documentar los pasos exactos para habilitarla desde el panel de admin de SuiteCRM.

---

**Próximo paso**: Una vez recibido el informe de Kimi Code, evaluar si:
- (a) Configuramos `fetch` para consumir la API REST directamente, o
- (b) Construimos un MCP custom para SuiteCRM, o
- (c) Consultamos la base de datos MariaDB directamente desde la VM openclaw-server.
