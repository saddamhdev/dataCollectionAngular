import { RenderMode, ServerRoute } from '@angular/ssr';
import { environment } from './app/environments/environment';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async (): Promise<Array<Record<string, string>>> => {
      try {
        const res = await fetch(`${environment.baseUrl}/api/projects`);
        if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
        const projects: Array<{ id: string|number }> = await res.json();

        return projects.map(p => ({ id: String(p.id) }));
      } catch (e) {
        console.error('❌ Failed to fetch projects', e);
        return [{ id: '1' }, { id: '2' }, { id: '3' }];
      }
    },
  },
];