import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const TEX_TIMEOUT_MS = Number.parseInt(process.env.RENDER_TIMEOUT_MS ?? '20000', 10);

let latexmkAvailable: boolean | null = null;

const ensureLatexmkAvailable = () => {
  if (latexmkAvailable) {
    return;
  }

  const result = spawnSync('latexmk', ['-v'], { stdio: 'ignore' });
  latexmkAvailable = result.status === 0;
  if (!latexmkAvailable) {
    throw new Error('latexmk command not found. Install TeX Live / latexmk in the renderer environment.');
  }
};

const runLatexmk = (workdir: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const args = ['-pdf', '-interaction=nonstopmode', '-halt-on-error', 'main.tex'];
    const child = spawn('latexmk', args, { cwd: workdir });
    let log = '';

    child.stdout.on('data', (chunk) => {
      log += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      log += chunk.toString();
    });

    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`Rendering timed out after ${TEX_TIMEOUT_MS}ms.\n${log}`));
    }, TEX_TIMEOUT_MS);

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve(log);
      } else {
        reject(new Error(`latexmk exited with code ${code}.\n${log}`));
      }
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
};

export const compileLatexToPdf = async (latexSource: string) => {
  ensureLatexmkAvailable();
  const tempDir = await mkdtemp(path.join(tmpdir(), 'latex-render-'));
  const texPath = path.join(tempDir, 'main.tex');
  await writeFile(texPath, latexSource, 'utf8');

  try {
    const log = await runLatexmk(tempDir);
    const pdfPath = path.join(tempDir, 'main.pdf');
    const pdfBuffer = await readFile(pdfPath);
    return { pdfBuffer, log };
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
};
