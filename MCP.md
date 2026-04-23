# MCP — Model Context Protocol

Documentación de los servidores MCP instalados en esta instancia de KimiClaw/OpenClaw.

## Servidor MCP activo

### `filesystem`

Expone herramientas de lectura/escritura de archivos al agente y a Kimi Code CLI.

- **Paquete**: `@modelcontextprotocol/server-filesystem`
- **Binario**: `/home/agustin/.nvm/versions/node/v24.15.0/bin/mcp-server-filesystem`
- **Root permitido**: `/home/agustin`
- **Instalación**:
  ```bash
  npm install -g @modelcontextprotocol/server-filesystem
  ```

### Sistemas conectados

| Sistema | Archivo de config | Formato |
|---------|-------------------|---------|
| **Kimi Code CLI** | `~/.kimi/mcp.json` | `mcpServers.{name}.command + .args` |
| **OpenClaw/KimiClaw** | `~/.openclaw/openclaw.json` | `mcp.servers.{name}.command + .args` |

### Configuración de Kimi Code CLI

`~/.kimi/mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "/home/agustin/.nvm/versions/node/v24.15.0/bin/mcp-server-filesystem",
      "args": ["/home/agustin"]
    }
  }
}
```

Verificación:
```bash
kimi mcp list
```

### Configuración de OpenClaw/KimiClaw

`~/.openclaw/openclaw.json` (sección `mcp.servers`):

```json
{
  "mcp": {
    "servers": {
      "filesystem": {
        "command": "/home/agustin/.nvm/versions/node/v24.15.0/bin/mcp-server-filesystem",
        "args": ["/home/agustin"]
      }
    }
  }
}
```

Verificación:
```bash
openclaw mcp list
```

Después de modificar, reiniciar el gateway:
```bash
systemctl --user restart openclaw-gateway.service
```

### Herramientas expuestas

El servidor `filesystem` expone al modelo herramientas como:

- `read_file` — leer contenido de un archivo
- `write_file` — escribir/sobrescribir un archivo
- `list_directory` — listar contenido de un directorio
- `search_files` — buscar texto en archivos
- `get_file_info` — metadata (tamaño, permisos, fechas)

Todas operan dentro de `/home/agustin` (no pueden salir de ese root).

### Reproducción en otra VM

1. Instalar Node.js y npm.
2. Instalar el servidor:
   ```bash
   npm install -g @modelcontextprotocol/server-filesystem
   ```
3. Copiar o recrear `~/.kimi/mcp.json`.
4. Copiar o recrear la sección `mcp.servers` de `~/.openclaw/openclaw.json`.
5. Reiniciar `openclaw-gateway.service`.

### Notas

- El servidor usa transporte **stdio** (pipes), no HTTP/SSE.
- Corre como proceso hijo del cliente (Kimi CLI u OpenClaw gateway) cuando se invoca una herramienta.
- No requiere servicio systemd propio.
