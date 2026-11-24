// Junta o build web do Expo (pasta dist/) num único arquivo: web/index.html
// Uso: npm run build:web
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const outDir = path.join(root, 'web');

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.ttf': 'font/ttf', '.ico': 'image/x-icon' };
const dataUri = (file) =>
  `data:${MIME[path.extname(file).toLowerCase()] || 'application/octet-stream'};base64,${fs.readFileSync(file).toString('base64')}`;

let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

// 1) Script do app embutido no fim do <body> (substitui o <script defer> do <head>)
const scripts = [];
html = html.replace(/<script src="([^"]+)"[^>]*><\/script>/g, (_, src) => {
  let js = fs.readFileSync(path.join(dist, src), 'utf8');
  // 2) Imagens e fontes referenciadas como "/assets/..." viram data URIs
  js = js.replace(/"(\/assets\/[^"]+)"/g, (m, url) => {
    const file = path.join(dist, decodeURIComponent(url));
    return fs.existsSync(file) ? JSON.stringify(dataUri(file)) : m;
  });
  scripts.push(`<script>${js.replace(/<\/script/gi, '<\\/script')}</script>`);
  return '';
});
html = html.replace('</body>', () => `${scripts.join('\n')}\n</body>`);

// 3) Favicon embutido
html = html.replace(/href="\/favicon\.ico"/, () => `href="${dataUri(path.join(dist, 'favicon.ico'))}"`);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log(`web/index.html gerado (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB)`);
