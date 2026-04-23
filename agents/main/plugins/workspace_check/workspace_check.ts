import { ToolContext, ToolResult } from '@openclaw/core';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Cache simple en memoria del proceso (vida útil: 60 segundos)
let cachedGitStatus: string | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60000;

export async function execute(context: ToolContext): Promise<ToolResult> {
  const workspacePath = '/home/agustin/openclaw-workspace';
  let gitStatusOutput = '';
  let error = '';

  try {
    const now = Date.now();
    if (cachedGitStatus && (now - cachedAt) < CACHE_TTL_MS) {
      gitStatusOutput = cachedGitStatus;
    } else {
      const { stdout, stderr } = await execPromise('git status --short', {
        cwd: workspacePath,
        timeout: 5000,
      });
      if (stderr) {
        error += `Git Status Warn: ${stderr}\n`;
      }
      gitStatusOutput = stdout || '(sin cambios)';
      cachedGitStatus = gitStatusOutput;
      cachedAt = now;
    }
  } catch (e: any) {
    error += `Error: ${e.message}\n`;
  }

  return {
    success: error === '',
    data: {
      gitStatus: gitStatusOutput,
      error: error || undefined,
    },
  };
}
