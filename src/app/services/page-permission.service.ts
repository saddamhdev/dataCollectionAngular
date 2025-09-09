import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService} from './auth.service';

export interface ComponentSelection {
  id: number;
  name: string;
  checked: boolean;
}

export interface PageSelection {
  id: number;
  name: string;
  checked: boolean;
  components: ComponentSelection[];
}

export interface MenuSelection {
  id: number;
  name: string;
  checked: boolean;
  pages: PageSelection[];
}

export interface TreePermissionResponse {
  userId: number;
  userName: string;
  email: string;
  menus: MenuSelection[];
}

@Injectable({
  providedIn: 'root'
})
export class PagePermissionService {
  private apiUrl = `${environment.baseUrl}/api/pagePermissions`;

  // 👉 এখানে store করা হবে
  private permissions: MenuSelection[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadFromLocal();
  }

  /** ---------- API calls ---------- */
  getPermissionsByUser(userId: number): Observable<TreePermissionResponse> {
    return this.http.get<TreePermissionResponse>(`${this.apiUrl}/user/${userId}/tree`,
      { headers: this.authService.getAuthHeaders() });
  }

  getAllPermissions(): Observable<TreePermissionResponse[]> {
    return this.http.get<TreePermissionResponse[]>(`${this.apiUrl}/user/all/tree`,
      { headers: this.authService.getAuthHeaders() });
  }

  assignTreePermissions(payload: TreePermissionResponse): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/tree`, payload,
      { headers: this.authService.getAuthHeaders() });
  }

  deletePermission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`,
      { headers: this.authService.getAuthHeaders() });
  }

  /** ---------- Local Storage Helper ---------- */
loadFromLocal() {
  // ✅ Browser এ আছি কি না check
  if (typeof window === 'undefined' || !localStorage) {
    console.warn("localStorage not available (SSR mode)");
    return;
  }

  const permStr = localStorage.getItem('accessComponent');
  if (permStr) {
    try {
      const parsed: TreePermissionResponse | MenuSelection[] = JSON.parse(permStr);
      if ((parsed as TreePermissionResponse).menus) {
        this.permissions = (parsed as TreePermissionResponse).menus;
      } else if (Array.isArray(parsed)) {
        this.permissions = parsed;
      }
    } catch (e) {
      console.error('❌ JSON parse failed:', e);
    }
  }
}


  /** ---------- Permission Check Methods ---------- */

  

hasMenu(menuName: string): boolean {
  if (!Array.isArray(this.permissions)) return false;

  const menu = this.permissions.find(
    (m: MenuSelection) => m.name.toLowerCase() === menuName.toLowerCase()
  );

  if (!menu) return false;

  // 1. Menu নিজে checked থাকলে TRUE
  if (menu.checked) return true;

  // 2. যদি কোনো page.checked === true থাকে
  const anyPageChecked = menu.pages?.some(p => p.checked);
  if (anyPageChecked) return true;

  return false;
}


  // 🔹 Page check
hasPage(menuName: string, pageName: string): boolean {
    if (!Array.isArray(this.permissions)) return false;
    const menu = this.permissions.find(m => m.name.toLowerCase() === menuName.toLowerCase());
    if (!menu) return false;

    return menu.pages?.some(
      p =>
        p.name.toLowerCase() === pageName.toLowerCase() &&
        (p.checked || p.components?.some(c => c.checked))
    ) ?? false;
  }



// 🔹 Component check
hasComponent(menuName: string, pageName: string, componentName: string): boolean {
  if (!Array.isArray(this.permissions)) return false;

  // Menu খুঁজে বের করা (checked না হলেও allow করা হচ্ছে)
  const menu = this.permissions.find(
    (m: MenuSelection) => m.name.toLowerCase() === menuName.toLowerCase()
  );
  if (!menu) return false;

  // Page খুঁজে বের করা (checked না হলেও allow করা হচ্ছে)
  const page = menu.pages?.find(
    (p: PageSelection) => p.name.toLowerCase() === pageName.toLowerCase()
  );
  if (!page) return false;

  // Component খুঁজে বের করা
  const component = page.components?.find(
    (c: ComponentSelection) => c.name.toLowerCase() === componentName.toLowerCase()
  );

  const found = !!component && component.checked === true;

  return found;
}
}
