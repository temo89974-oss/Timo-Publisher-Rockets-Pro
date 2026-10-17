import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import {
  analyzeKeywordsWithGemini,
  analyzeCompetitionWithGemini,
  analyzeCategoriesWithGemini,
  generateAmazonAdsWithGemini,
  generateBookTitlesWithGemini,
  translateTextWithGemini,
} from './server/geminiService';

dotenv.config();

function apiPlugin(): Plugin {
  return {
    name: 'api-server-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Helper to read JSON request body
        const getBody = async (): Promise<any> => {
          return new Promise((resolve) => {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                resolve(JSON.parse(body || '{}'));
              } catch (e) {
                resolve({});
              }
            });
          });
        };

        const sendJson = (data: any, status = 200) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        try {
          const pathname = req.url.split('?')[0];

          if (pathname === '/api/analyze-keywords' && req.method === 'POST') {
            const body = await getBody();
            const results = await analyzeKeywordsWithGemini(
              body.query || 'self help',
              body.marketplace || 'US',
              body.format || 'all'
            );
            return sendJson({ success: true, data: results });
          }

          if (pathname === '/api/analyze-competition' && req.method === 'POST') {
            const body = await getBody();
            const results = await analyzeCompetitionWithGemini(
              body.query || 'habits',
              body.marketplace || 'US'
            );
            return sendJson({ success: true, data: results });
          }

          if (pathname === '/api/analyze-categories' && req.method === 'POST') {
            const body = await getBody();
            const results = await analyzeCategoriesWithGemini(
              body.query || 'fiction',
              body.storeType || 'Kindle Store'
            );
            return sendJson({ success: true, data: results });
          }

          if (pathname === '/api/generate-ads' && req.method === 'POST') {
            const body = await getBody();
            const results = await generateAmazonAdsWithGemini(
              body.query || 'romance',
              body.authorOrBook || ''
            );
            return sendJson({ success: true, data: results });
          }

          if (pathname === '/api/generate-titles' && req.method === 'POST') {
            const body = await getBody();
            const results = await generateBookTitlesWithGemini(
              body.genre || 'Thriller',
              body.coreHook || 'conspiracy',
              body.targetAudience || 'adult readers'
            );
            return sendJson({ success: true, data: results });
          }

          if (pathname === '/api/translate' && req.method === 'POST') {
            const body = await getBody();
            const translated = await translateTextWithGemini(
              body.text || '',
              body.targetLang || 'ar',
              body.engine || 'gemini'
            );
            return sendJson({ success: true, translated });
          }

          return sendJson({ error: 'Endpoint not found' }, 404);
        } catch (err: any) {
          console.error('API Middleware Error:', err);
          return sendJson({ error: err.message || 'Server error' }, 500);
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
