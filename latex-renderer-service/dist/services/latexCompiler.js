"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileLatexToPdf = void 0;
const promises_1 = require("node:fs/promises");
const node_os_1 = require("node:os");
const node_path_1 = __importDefault(require("node:path"));
const node_child_process_1 = require("node:child_process");
const TEX_TIMEOUT_MS = Number.parseInt(process.env.RENDER_TIMEOUT_MS ?? '20000', 10);
let latexmkAvailable = null;
const ensureLatexmkAvailable = () => {
    if (latexmkAvailable) {
        return;
    }
    const result = (0, node_child_process_1.spawnSync)('latexmk', ['-v'], { stdio: 'ignore' });
    latexmkAvailable = result.status === 0;
    if (!latexmkAvailable) {
        throw new Error('latexmk command not found. Install TeX Live / latexmk in the renderer environment.');
    }
};
const runLatexmk = (workdir) => {
    return new Promise((resolve, reject) => {
        const args = ['-pdf', '-interaction=nonstopmode', '-halt-on-error', 'main.tex'];
        const child = (0, node_child_process_1.spawn)('latexmk', args, { cwd: workdir });
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
            }
            else {
                reject(new Error(`latexmk exited with code ${code}.\n${log}`));
            }
        });
        child.on('error', (error) => {
            clearTimeout(timeout);
            reject(error);
        });
    });
};
const compileLatexToPdf = async (latexSource) => {
    ensureLatexmkAvailable();
    const tempDir = await (0, promises_1.mkdtemp)(node_path_1.default.join((0, node_os_1.tmpdir)(), 'latex-render-'));
    const texPath = node_path_1.default.join(tempDir, 'main.tex');
    await (0, promises_1.writeFile)(texPath, latexSource, 'utf8');
    try {
        const log = await runLatexmk(tempDir);
        const pdfPath = node_path_1.default.join(tempDir, 'main.pdf');
        const pdfBuffer = await (0, promises_1.readFile)(pdfPath);
        return { pdfBuffer, log };
    }
    finally {
        await (0, promises_1.rm)(tempDir, { recursive: true, force: true }).catch(() => { });
    }
};
exports.compileLatexToPdf = compileLatexToPdf;
//# sourceMappingURL=latexCompiler.js.map