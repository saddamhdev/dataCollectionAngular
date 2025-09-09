import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.baseUrl;  

  constructor(private http: HttpClient) {}

  // Call backend login
  login(username: string, password: string): Observable<any> {
    const loginUrl = `${this.apiUrl}/api/users/login`;
    return this.http.post(loginUrl, { username, password });
  }

  // Store token (from backend response)
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

 
public getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }

  public getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }
  // Check if logged in
  isLoggedIn(): boolean {
    return !!this.getToken(); // true if token exists
  }

  // Clear token on logout
  logout(): void {
    localStorage.removeItem('authToken');
  }
}
