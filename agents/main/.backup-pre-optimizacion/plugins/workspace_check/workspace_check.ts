import { ToolContext, ToolResult } from '@openclaw/core';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function execute(context: ToolContext): Promise<ToolResult> {
  const workspacePath = '/home/agustin/openclaw-workspace';
  let gitStatusOutput = '';
  let openclawStatusOutput = '';
  let error = '';

  try {
    // 1. Obtener el git status del workspace
    const { stdout: gitStdout, stderr: gitStderr } = await execPromise('git status', { cwd: workspacePath });
    if (gitStderr) {
      // Registrar errores pero no fallar el plugin si uno de los comandos falla
      error += `Git Status Error: ${gitStderr}\n`;
    }
    gitStatusOutput = gitStdout;

    // 2. Obtener el estado de OpenClaw (incluyendo posibles actualizaciones)
    const { stdout: ocStdout, stderr: ocStderr } = await execPromise('openclaw status');
    if (ocStderr) {
      error += `OpenClaw Status Error: ${ocStderr}\n`;
    }
    openclawStatusOutput = ocStdout;

  } catch (e: any) {
    error += `Error general de ejecución: ${e.message}\n`;
  }

  return {
    success: error === '', // Considera 'success' si no hubo errores críticos
    data: {
      gitStatus: gitStatusOutput,
      openclawStatus: openclawStatusOutput,
      error: error || undefined, // Si no hay errores, no incluyas la propiedad
    }
  };
}