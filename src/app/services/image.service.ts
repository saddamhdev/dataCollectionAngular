import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { PagePermissionService } from './page-permission.service';
import { HttpHeaders } from '@angular/common/http';
import { AuthService} from './auth.service';

export interface ImageRecord {
  id: number;
  batch: string;
  status: string;
  fileName: string;
  filePath: string;
  uploadedAt: string;
}
@Injectable({
  providedIn: 'root'
})
export class ImageService {
   private baseUrl = environment.baseUrl;

  private apiUrl = `${this.baseUrl}/api/image`; // backend endpoint

  constructor(private http: HttpClient, public pagePermissionService: PagePermissionService, public authService: AuthService) {}
 public getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }
  uploadImage(batch: string, status: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('batch', batch);
    formData.append('status', status);
    formData.append('image', file);

    return this.http.post(`${this.apiUrl}/upload`, formData, { headers: this.getAuthHeaders() });
  }
   getImages(): Observable<ImageRecord[]> {
    return this.http.get<ImageRecord[]>(`${this.apiUrl}/images`);
  }
updateImage(data: { id: string; batch: string; status: string }) {
  return this.http.post(`${this.apiUrl}/update`, data, { headers: this.authService.getAuthHeaders() });
}


deleteImage(id: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/delete`, { id }, { headers: this.authService.getAuthHeaders() });
}

  
}
