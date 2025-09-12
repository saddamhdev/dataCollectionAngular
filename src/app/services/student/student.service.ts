import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';

export interface StudentSubmission {
  id?: number;
  banglaName: string;
  englishName: string;
  sscRoll: string;
  sscMark: string;
  hscRoll: string;
  hscMark: string;
  guardianMobile: string;
  highSchool: string;
  sscDept: string;
  sscResult: string;
  college: string;
  hscDept: string;
  hscResult: string;
  division: string;
  district: string;
  upazila: string;
  target: string;
  mobile: string;
  email: string;
  comments?: string;
  agree: boolean;
  createdAt?: string;
  updatedAt?: string;
  informationType?: string;  // New field to indicate type of information (e.g., 'SSC', 'HSC', etc.)
}

// Backend response when using Spring Data Page<>
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;   // current page index (0-based)
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private selectedStudent$ = new BehaviorSubject<StudentSubmission | null>(null);
   constructor(private authService: AuthService) {}
  /**
   * Submit a student form (with or without file)
   */
  async submitStudent(data: StudentSubmission, file: File | null) {
    console.log('[StudentService] about to submit:', data);

    if (file) {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) =>
        form.append(k, v != null ? String(v) : '')
      );
      form.append('resume', file);

      const res = await firstValueFrom(
        this.http.post(`${this.baseUrl}/api/students/submit`, form)
      );
      console.log('[StudentService] server response:', res);
      return res;
    } else {
      const res = await firstValueFrom(
        this.http.post(`${this.baseUrl}/api/students/submit`, data)
      );
      console.log('[StudentService] server response:', res);
      return res;
    }
  }

  /**
   * Fetch all students (⚠️ not recommended for large data sets)
   */
  getAll(): Observable<StudentSubmission[]> {
    return this.http.get<StudentSubmission[]>(`${this.baseUrl}/api/students/submit`,
       { headers: this.authService.getAuthHeaders() } );
  }

  /**
   * ✅ Fetch paginated + sorted students from backend
   */
  getPaged(
    page: number,
    size: number,
    sortBy: string,
    direction: 'asc' | 'desc',
    type?: string
  ): Observable<PagedResponse<StudentSubmission>> {
    return this.http.get<PagedResponse<StudentSubmission>>(
      `${this.baseUrl}/api/students/submit/page?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}&type=${type}`, { headers: this.authService.getAuthHeaders() }
    );
  }

  getBySscRoll(roll: string): Observable<StudentSubmission | null> {
    return this.http.get<StudentSubmission | null>(`${this.baseUrl}/api/students/submit/ssc/${roll}`, { headers: this.authService.getAuthHeaders() });
  }

  deleteStudent(id: number): Observable<void> {
  return this.http.post<void>(
    `${this.baseUrl}/api/students/submit/${id}/delete`,
    {}, // empty body
    { headers: this.authService.getAuthHeaders() }
  );
}


getById(id: number): Observable<StudentSubmission> {
  return this.http.get<StudentSubmission>(
    `${this.baseUrl}/api/students/submit/${id}`,
    { headers: this.authService.getAuthHeaders() }
  );
}
updateStudent(id: number, student: any): Observable<StudentSubmission> {
  return this.http.post<StudentSubmission>(
    `${this.baseUrl}/api/students/submit/${id}`,
    student,
    { headers: this.authService.getAuthHeaders() }
  );
 }

 // ✅ Shared State
  setSelectedStudent(student: StudentSubmission) {
    this.selectedStudent$.next(student);
  }

  getSelectedStudent(): Observable<StudentSubmission | null> {
    return this.selectedStudent$.asObservable();
  }

  clearSelectedStudent() {
    this.selectedStudent$.next(null);
  }
}
