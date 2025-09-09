import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Page } from './page.service';
import { PagePermissionService } from './page-permission.service';
import { AuthService} from './auth.service';

export interface ComponentItem {
  id: number;
  name: string;
  pageName: string;
  menuName: string;
}


@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  private apiUrl = `${environment.baseUrl}/api/components`;

  constructor(private http: HttpClient, public pagePermissionService: PagePermissionService, public authService: AuthService) {}

  getComponents(): Observable<ComponentItem[]> {
    return this.http.get<ComponentItem[]>(this.apiUrl, { headers: this.authService.getAuthHeaders() });
  }

  addComponent(component: { name: string; pageId: number }): Observable<ComponentItem> {
    return this.http.post<ComponentItem>(this.apiUrl, component, { headers: this.authService.getAuthHeaders() });
  }

deleteComponent(id: number): Observable<void> {
  return this.http.post<void>(
    `${this.apiUrl}/${id}/delete`,
    {}, // ✅ pass empty body, otherwise headers object is misinterpreted
    { headers: this.authService.getAuthHeaders() }
  );
}

}
