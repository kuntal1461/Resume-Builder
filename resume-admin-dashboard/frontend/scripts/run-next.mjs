import { spawn } from 'node:child_process';

const [command, ...cliArgs] = process.argv.slice(2);

if (!command) {
  console.error('Usage: node scripts/run-next.mjs <command> [args]');
  process.exit(1);
}

const normalizedArgs = [...cliArgs];
const hasPortFlag = normalizedArgs.some((arg) => arg === '-p' || arg === '--port');
const hasHostFlag = normalizedArgs.some((arg) => arg === '-H' || arg === '--hostname');

const defaultPort = process.env.PORT ?? '3100';
const defaultHost = process.env.HOST ?? 'localhost';

if (!hasPortFlag) {
  normalizedArgs.push('-p', defaultPort);
}

if (command === 'dev' && !hasHostFlag) {
  normalizedArgs.push('-H', defaultHost);
}

if (command === 'dev' && !normalizedArgs.some((arg) => arg === '--turbo' || arg === '--webpack')) {
  normalizedArgs.push('--webpack');
}

const child = spawn('next', [command, ...normalizedArgs], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
