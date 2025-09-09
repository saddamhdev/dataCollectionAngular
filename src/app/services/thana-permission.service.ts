import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { PagePermissionService } from './page-permission.service';
import { AuthService} from './auth.service';

@Injectable({ providedIn: 'root' })
export class ThanaPermissionService {

 private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, public pagePermissionService: PagePermissionService, public authService: AuthService) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`, { headers: this.authService.getAuthHeaders() });
  }

  getDivisions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/divisions`, { headers: this.authService.getAuthHeaders() });
  }

  getDistricts(divisionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/districts?divisionId=${divisionId}`, { headers: this.authService.getAuthHeaders() });
  }

  getThanas(districtId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/thanas?districtId=${districtId}`, { headers: this.authService.getAuthHeaders() });
  }

savePermissions(
  userId: number, // ✅ number in Angular
  payload: { division: string | null; district: string | null; thanaNames: string[] }
): Observable<any> {
  return this.http.post(`${this.baseUrl}/api/thana/${userId}/permissions`, payload, { headers: this.authService.getAuthHeaders() });
}
getPermissions(userId: number, division: string, district: string): Observable<any> {
  return this.http.get(
    `${this.baseUrl}/api/thana/${userId}/permissions?division=${division}&district=${district}`, { headers: this.authService.getAuthHeaders() }
  );
}
getUserPermissions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/users_permissions`, { headers: this.authService.getAuthHeaders() });
  }

}
