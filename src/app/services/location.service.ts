// src/app/services/location.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { PagePermissionService } from './page-permission.service';
import { AuthService} from './auth.service';


@Injectable({ providedIn: 'root' })
export class LocationService {
   private baseUrl = environment.baseUrl;

   private apiUrl = `${this.baseUrl}/api/locations`;
  

  constructor(private http: HttpClient, public pagePermissionService: PagePermissionService, public authService: AuthService) {}

  getLocations(): Observable<Record<string, Record<string, string[]>>> {
    return this.http.get<Record<string, Record<string, string[]>>>(this.apiUrl);
  }
}
