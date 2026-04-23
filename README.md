# KimiClaw — DataMaq

Repositorio de personalizaciones de [KimiClaw](https://github.com/openclaw/openclaw) (OpenClaw) para **DataMaq**, empresa de servicios técnicos e industrial-digitales en AMBA.

## Qué es esto

Este repo contiene la configuración, la identidad y los plugins del agente AI **"Tenazas" 🦞**, un CEO virtual optimizado para tomar decisiones ejecutivas, gestionar riesgos y estandarizar la operación de DataMaq.

El agente se comunica a través de:
- **Kimi** (bridge nativo)
- **Telegram** (bot dedicado)

Y utiliza modelos de lenguaje de Google Vertex AI (`gemini-2.5-flash`) enrutados vía proxy local.

## Estructura del repo

```
.
├── README.md                 # Este archivo
├── MCP.md                    # Documentación de servidores MCP configurados
├── GITHUB_SETUP.md           # Guía para crear cuenta/token de GitHub dedicados
│
└── agents/
    └── main/                 # Agente principal: "Tenazas"
        ├── AGENTS.md         # Reglas operativas, delegación, formato de respuesta
        ├── SOUL.md           # Personalidad, tono y misión del agente
        ├── TOOLS.md          # Notas del entorno, rutas y convenciones
        ├── USER.md           # Perfil del usuario (Agustín)
        ├── IDENTITY.md       # Identidad visual del agente
        ├── HEARTBEAT.md      # Tareas periódicas (vacío = desactivado)
        ├── avatars/          # Assets visuales (SVG, JPG)
        │
        └── plugins/
            └── workspace_check/   # Plugin custom: estado del workspace
                ├── workspace_check.ts
                └── workspace_check.tools.json
```

## Infraestructura asociada

| Componente | Ubicación / Repo | Propósito |
|------------|-----------------|-----------|
| **KimiClaw Gateway** | `~/.openclaw/` (systemd user) | Gateway de OpenClaw 2026.4.15 |
| **Vertex AI Proxy** | `~/.openclaw/vertex-proxy.js` | Proxy local para Google Vertex AI |
| **Kimi Code CLI** | `~/.local/bin/kimi` (v1.37.0) | CLI para desarrollo y coding |
| **MCP Filesystem** | `mcp-server-filesystem` | Acceso a archivos locales |
| **MCP GitHub** | `@modelcontextprotocol/server-github` | Gestión de repos, issues y PRs |

## Historial de optimizaciones

- **Reducción de contexto**: de ~4.400 a ~1.650 tokens fijos por interacción (-62%) mediante fusión y condensación de `AGENTS.md` + `SOUL.md`.
- **Limpieza de VM**: eliminación de residuos Docker, cachés y backups obsoletos (+5 GB de disco recuperados).
- **Swap y límites de memoria**: swapfile de 2 GB + `MemoryMax=700M` en el gateway.
- **MCPs**: instalación y documentación de servidores `filesystem` y `github` para Kimi CLI y OpenClaw.

## Reproducción del entorno

1. Clonar este repo.
2. Seguir `GITHUB_SETUP.md` para configurar cuenta/token de GitHub dedicados.
3. Instalar KimiClaw/OpenClaw según el [script oficial](https://cdn.kimi.com/kimi-claw/claw-install.sh).
4. Copiar o recrear las configuraciones de MCP (`~/.kimi/mcp.json`, `~/.openclaw/openclaw.json`).
5. Reiniciar servicios: `systemctl --user restart openclaw-gateway.service`.

## Contacto

- **Empresa**: [DataMaq](https://datamaq.com.ar)
- **Autor**: Agustín
- **Agente**: Tenazas 🦞
