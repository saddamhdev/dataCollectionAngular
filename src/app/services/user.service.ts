import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { PagePermissionService } from './page-permission.service';
import { AuthService} from './auth.service';
import { StudentSubmission } from './student/student.service';
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  userType: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private baseUrl = environment.baseUrl;

  private apiUrl = `${this.baseUrl}/api/users`; // Spring Boot backend

  constructor(private http: HttpClient, public pagePermissionService: PagePermissionService, public authService: AuthService) {}
// user.service.ts
private selectedUser$ = new BehaviorSubject<User | null>(null);

setSelectedUser(user: User) {
  this.selectedUser$.next(user);
}

getSelectedUser(): Observable<User | null> {
  return this.selectedUser$.asObservable();
}

  // Create User
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, user, { headers: this.authService.getAuthHeaders() });
  }

  // Get All Users (optional, for list page)
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.authService.getAuthHeaders() });
  }
deleteUser(id: number): Observable<void> {
  return this.http.post<void>(
    `${this.apiUrl}/${id}/delete`,
    {},
    { headers: this.authService.getAuthHeaders() }
  );
}

  // Get User by ID
  getById(id: number): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/${id}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }
  // Update User
updateUser(id: number, user: User): Observable<User> {
  return this.http.post<User>(
    `${this.apiUrl}/${id}/update`,
    user,
    { headers: this.authService.getAuthHeaders() }
  );
}

}
