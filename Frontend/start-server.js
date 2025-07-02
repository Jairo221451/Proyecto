import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Logs detallados del entorno
console.log('=== RAILWAY STARTUP DIAGNOSTICS ===');
console.log('Current working directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
console.log('- PWD:', process.env.PWD);

// Verificar archivos
console.log('\n=== FILE SYSTEM CHECK ===');
try {
  const distExists = fs.existsSync('./dist');
  console.log('dist/ folder exists:', distExists);
  
  if (distExists) {
    const distContents = fs.readdirSync('./dist');
    console.log('dist/ contents:', distContents);
    
    const indexExists = fs.existsSync('./dist/index.html');
    console.log('dist/index.html exists:', indexExists);
  }
  
  const packageExists = fs.existsSync('./package.json');
  console.log('package.json exists:', packageExists);
  
  if (packageExists) {
    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    console.log('Package name:', pkg.name);
    console.log('Package scripts:', Object.keys(pkg.scripts));
  }
} catch (err) {
  console.error('Error checking files:', err.message);
}

const port = process.env.PORT || 8080;
console.log(`\n=== STARTING SERVER ===`);
console.log(`Port selected: ${port} (type: ${typeof port})`);

// Comando completo que se va a ejecutar
const command = ['vite', 'preview', '--host', '0.0.0.0', '--port', port.toString()];
console.log('Full command:', 'npx', command.join(' '));

const server = spawn('npx', command, {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true,
  env: { ...process.env }
});

// Capturar stdout
server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('[VITE STDOUT]:', output);
});

// Capturar stderr
server.stderr.on('data', (data) => {
  const output = data.toString();
  console.log('[VITE STDERR]:', output);
});

server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`🔄 Server process exited with code ${code}`);
  if (code !== 0) {
    console.error('❌ Server crashed');
    process.exit(code);
  }
});

// Manejo de señales
process.on('SIGTERM', () => {
  console.log('📶 Received SIGTERM, shutting down gracefully');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📶 Received SIGINT, shutting down gracefully');
  server.kill('SIGINT');
});