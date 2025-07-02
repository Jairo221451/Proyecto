import { spawn } from 'child_process';

const port = process.env.PORT || 8080;

console.log(`Starting server on port: ${port}`);

const server = spawn('npx', ['vite', 'preview', '--host', '0.0.0.0', '--port', port.toString()], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});