import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import breachRoutes from './server/routes/breachRoutes.js';
import { loadPublicBreachCatalog } from './server/services/breachService.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  // Basic security and parsing middleware
  app.use(express.json({ limit: '100kb' }));
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // API health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Email Breach & Security Intelligence Platform',
    });
  });

  // Mount primary API routes
  app.use('/api', breachRoutes);

  // Catch-all 404 handler for /api routes - guarantees API calls NEVER fall through to Vite HTML
  app.use('/api', (req, res) => {
    res.status(404).json({
      error: `API endpoint not found: ${req.method} ${req.originalUrl}`,
      status: 404,
    });
  });

  // Global error handler for /api routes - guarantees errors return JSON, never HTML
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.originalUrl.startsWith('/api') || req.path.startsWith('/api')) {
      console.error('[API Error Handler]', err);
      res.status(err.status || 500).json({
        error: err.message || 'An unexpected server error occurred.',
        status: err.status || 500,
      });
      return;
    }
    next(err);
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Pre-fetch public breach catalog in the background for low-latency queries
  loadPublicBreachCatalog().catch((err) => {
    console.warn('[Server] Initial catalog pre-fetch notice:', err.message);
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Security Platform] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Fatal]', err);
  process.exit(1);
});
