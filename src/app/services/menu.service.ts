import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { PagePermissionService } from './page-permission.service';
import { AuthService} from './auth.service';

export interface Menu {
  id: number;
  name: string;
}


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = `${environment.baseUrl}/api/menus`;

  constructor(private http: HttpClient, public pagePermissionService: PagePermissionService, public authService: AuthService) {}

  getMenus(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.apiUrl, { headers: this.authService.getAuthHeaders() });
  }

  addMenu(menu: { name: string }): Observable<Menu> {
    return this.http.post<Menu>(this.apiUrl, menu, { headers: this.authService.getAuthHeaders() });
  }

  deleteMenu(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/delete`, 
      {}, // ✅ pass empty body, otherwise headers object is misinterpreted
      { headers: this.authService.getAuthHeaders() }
    );
  }
}
