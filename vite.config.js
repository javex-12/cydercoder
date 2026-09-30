import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));

/** Run Vercel-style /api handlers during `vite dev` */
function apiDevPlugin() {
  return {
    name: 'api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] || '';
        if (!url.startsWith('/api/')) return next();

        const name = url.replace('/api/', '');
        if (!name || name.includes('..')) return next();

        try {
          const mod = await server.ssrLoadModule(path.join(root, 'api', `${name}.js`));
          const handler = mod.default;
          if (typeof handler !== 'function') return next();

          const chunks = [];
          await new Promise((resolve, reject) => {
            req.on('data', (c) => chunks.push(c));
            req.on('end', resolve);
            req.on('error', reject);
          });

          const raw = Buffer.concat(chunks).toString();
          let body = {};
          if (raw) {
            try {
              body = JSON.parse(raw);
            } catch {
              body = raw;
            }
          }

          const mockReq = {
            method: req.method,
            headers: req.headers,
            body,
            socket: { remoteAddress: '127.0.0.1' },
          };

          const mockRes = {
            statusCode: 200,
            headers: {},
            setHeader(k, v) {
              this.headers[k] = v;
            },
            status(code) {
              this.statusCode = code;
              return this;
            },
            json(data) {
              res.statusCode = this.statusCode;
              Object.entries(this.headers).forEach(([k, v]) => res.setHeader(k, v));
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            },
            end() {
              res.end();
            },
          };

          await handler(mockReq, mockRes);
        } catch (err) {
          console.error('[api-dev]', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Dev API error', detail: String(err?.message || err) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiDevPlugin()],
});
