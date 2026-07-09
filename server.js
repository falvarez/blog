const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = '/output_prod';
const WATCH_INTERVAL = 2000;

const clients = [];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function scanHtmlFiles(dir) {
  let files = {};
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        Object.assign(files, scanHtmlFiles(fullPath));
      } else if (entry.name.endsWith('.html')) {
        try {
          const stat = fs.statSync(fullPath);
          files[fullPath] = stat.mtimeMs;
        } catch (e) {}
      }
    }
  } catch (e) {}
  return files;
}

let prevFiles = {};
let pollCount = 0;

function pollChanges() {
  const current = scanHtmlFiles(ROOT);
  pollCount++;
  if (pollCount === 1) {
    prevFiles = current;
    return;
  }
  for (const [fp, mtime] of Object.entries(current)) {
    if (!prevFiles[fp] || prevFiles[fp] !== mtime) {
      console.log('change detected, reloading browsers');
      clients.forEach(c => c.write('data: reload\n\n'));
      break;
    }
  }
  prevFiles = current;
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    if (ext === '.html') {
      const inject =
        '<script>(function(){var e=new EventSource("/__reload");e.onmessage=function(m){if(m.data==="reload")location.reload()}})()</script>';
      const html = data.toString().replace('</body>', inject + '</body>');
      res.writeHead(200, { 'Content-Type': MIME['.html'] });
      res.end(html);
    } else {
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  if (u.pathname === '/__reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write('data: connected\n\n');
    clients.push(res);
    req.on('close', () => {
      const i = clients.indexOf(res);
      if (i !== -1) clients.splice(i, 1);
    });
    return;
  }
  let decodedPath = decodeURI(u.pathname);
  if (!decodedPath.endsWith('/') && decodedPath !== '/' && !path.extname(decodedPath)) {
    res.writeHead(302, { 'Location': u.pathname + '/' + u.search });
    res.end();
    return;
  }
  let filePath = decodedPath === '/'
    ? path.resolve(ROOT, './index.html')
    : path.resolve(ROOT, '.' + decodedPath);
  if (decodedPath.endsWith('/') && decodedPath !== '/') {
    filePath = path.join(filePath, 'index.html');
  }
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  setTimeout(() => {
    prevFiles = scanHtmlFiles(ROOT);
    console.log(`Watching ${Object.keys(prevFiles).length} HTML files`);
    setInterval(pollChanges, WATCH_INTERVAL);
  }, 6000);
});
