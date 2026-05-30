import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;

// ─────────────────────────────────────────────
// Cómo funciona el SSR (como Next.js):
//
// 1. El usuario entra a http://localhost:5173/listings
// 2. Express ejecuta renderToString(<App />) en el servidor
// 3. Genera el HTML completo (títulos, fotos, textos)
// 4. Lo envía al navegador → el usuario ve la página AL INSTANTE
// 5. El JS se descarga en segundo plano (entry-client.js)
// 6. React "hidrata" silenciosamente → los botones se activan
// ─────────────────────────────────────────────

async function createApp() {
  const app = express();

  let vite;        // Solo se usa en modo desarrollo local (fuera de Docker)
  let template;    // El HTML base con <!--app-html--> como placeholder
  let ssrRender;   // La función render() de entry-server.jsx

  if (isProduction) {
    // ── PRODUCCIÓN (Docker) ──────────────────
    // Servir los archivos estáticos compilados (JS, CSS, imágenes)
    app.use(express.static(path.resolve(__dirname, 'dist/client'), {
      index: false, // No servir index.html automáticamente — lo hacemos nosotros con SSR
    }));

    // Cargar el template HTML y la función de render UNA sola vez al iniciar
    template = await fs.readFile(
      path.resolve(__dirname, 'dist/client/index.html'),
      'utf-8'
    );
    const serverModule = await import('./dist/server/entry-server.js');
    ssrRender = serverModule.render;

    console.log('[SSR] Template y módulo del servidor cargados correctamente');
  } else {
    // ── DESARROLLO (local, fuera de Docker) ──
    // Usa Vite dev server con HMR para desarrollo rápido
    const { createServer } = await import('vite');
    vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  }

  // ── SSR HANDLER ──────────────────────────────
  // Este middleware captura TODAS las peticiones que piden HTML
  // y devuelve la página renderizada en el servidor
  app.use(async (req, res) => {
    // Solo renderizar páginas HTML — ignorar peticiones de archivos (.js, .css, favicon, etc.)
    const accept = req.headers.accept || '';
    if (!accept.includes('text/html')) {
      res.status(404).end();
      return;
    }

    try {
      const url = req.originalUrl;
      console.log(`[SSR] ${req.method} ${url}`);

      let pageHtml;
      let renderFn;

      if (isProduction) {
        // En producción: usar template y render cacheados
        pageHtml = template;
        renderFn = ssrRender;
      } else {
        // En desarrollo: leer archivos frescos en cada petición (para HMR)
        pageHtml = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
        pageHtml = await vite.transformIndexHtml(url, pageHtml);
        renderFn = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
      }

      // ¡Aquí ocurre la magia! React renderiza la app completa a HTML
      const appHtml = renderFn(url);

      // Inyectar el HTML de la app dentro del template
      const finalHtml = pageHtml.replace('<!--app-html-->', appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
    } catch (e) {
      vite?.ssrFixStacktrace(e);
      console.error('[SSR Error]', e.stack);
      res.status(500).end(e.stack);
    }
  });

  return app;
}

// Iniciar el servidor
createApp().then((app) => {
  app.listen(port, '0.0.0.0', () => {
    const mode = isProduction ? '🚀 PRODUCCIÓN' : '🔧 DESARROLLO';
    console.log(`[${mode}] SSR server → http://localhost:${port}`);
  });
});
