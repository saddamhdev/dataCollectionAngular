import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Menu } from './menu.service';
import { PagePermissionService } from './page-permission.service';
import { AuthService} from './auth.service';

export interface Page {
  id: number;
  name: string;
  menuName: string;
}


@Injectable({
  providedIn: 'root'
})
export class PageService {
  private apiUrl = `${environment.baseUrl}/api/pages`;

  constructor(private http: HttpClient, public pagePermissionService: PagePermissionService, public authservice: AuthService) {}

  getPages(): Observable<Page[]> {
    return this.http.get<Page[]>(this.apiUrl, { headers: this.authservice.getAuthHeaders() });
  }

 addPage(page: { name: string; menuId: number }): Observable<Page> {
  const body = {
    name: page.name,
    menu: { id: page.menuId }   // 👈 backend expects this format
  };
  return this.http.post<Page>(this.apiUrl, body, { headers: this.authservice.getAuthHeaders() });
}


  deletePage(id: number): Observable<void> {
      return this.http.post<void>(
      `${this.apiUrl}/${id}/delete`,
          {}, // ✅ pass empty body, otherwise headers object is misinterpreted
          { headers: this.authservice.getAuthHeaders() }
        );
  }
}
