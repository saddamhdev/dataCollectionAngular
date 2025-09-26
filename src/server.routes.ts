import { RenderMode, ServerRoute } from '@angular/ssr';
import { environment } from './app/environments/environment';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'dev/project-detail/:title',
    renderMode: RenderMode.Prerender,   // ✅ required field
    getPrerenderParams: async () => {
      try {
        const res = await fetch(environment.baseUrl + '/api/projects');
        if (!res.ok) {
          throw new Error('Failed to fetch projects');
        }
        const projects: any[] = await res.json();

        return projects.map((p) => ({
          title: slugify(p.title),
        }));
      } catch (e) {
        console.error('❌ Failed to fetch projects', e);
        // fallback static list
        return [
          { title: 'device-management' },
          { title: 'training-app' },
          { title: 'attendance-software' }
        ];
      }
    },
  },
];

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/\s+/g, '-')       // space → dash
    .replace(/[^\w-]+/g, '');   // remove special chars
}
