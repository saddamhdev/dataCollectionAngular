import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Routes } from '@angular/router';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
// Backend API থেকে project title আনার জন্য fetch ব্যবহার করা হবে
export const serverRoutes: Routes = [
  {
    path: 'dev/project-detail/:title',
    loadComponent: () =>
      import('./app/dev/project-detail/project-detail.component').then(
        (m) => m.ProjectDetailComponent
      ),
    data: {
      prerender: {
        getPrerenderParams: async () => {
          try {
            // 👉 এখানে আপনার backend API বসান
            const res = await fetch('http://localhost:8080/api/projects');
            const projects: any[] = await res.json();

            // প্রতিটি project থেকে title কে slug বানিয়ে return করবো
            return projects.map((p) => ({
              title: slugify(p.title),
            }));
          } catch (err) {
            console.error('❌ Failed to fetch projects for prerender:', err);
            return [];
          }
        },
      },
    },
  },
];

// Helper function for safe URLs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')     // space → dash
    .replace(/[^\w-]+/g, ''); // special chars remove
}
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
