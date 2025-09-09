import { Component, OnInit } from '@angular/core';
import { StudentService, StudentSubmission } from '../../services/student/student.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagePermissionService } from '../../services/page-permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ConfirmDeleteComponent } from '../shared/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-ssc-data',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDeleteComponent],
  templateUrl: './ssc-data.component.html',
  styleUrl: './ssc-data.component.css'
})
export class SscDataComponent {
students: any[] = [];
  loading = true;
  error: string | null = null;
  

  // ✅ Search term (frontend filter)
  searchTerm: string = '';

  // Pagination state
  currentPage = 1;
  pageSize = 2;
  totalPages = 0;

  // Sorting
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  private router = inject(Router);
// track delete target
  // ✅ Modal state
  showDeleteModal = false;
  studentToDelete: number | null = null;
  selectedUserId: number | null = null;
selectedUserName = '';
  constructor(private studentService: StudentService, public pagePermissionService: PagePermissionService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.loading = true;
    this.studentService.getPaged(
      this.currentPage - 1, // backend is 0-based
      this.pageSize,
      this.sortColumn,
      this.sortDirection,
      'SSC'

    ).subscribe({
      next: (res) => {
        this.students = res.content;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load data';
        this.loading = false;
      }
    });
  }

  // ✅ Search filter (applied on current page data)
  get filteredStudents() {
    if (!this.searchTerm) return this.students;
    const term = this.searchTerm.toLowerCase();
    return this.students.filter(s =>
      Object.values(s).some(val =>
        val?.toString().toLowerCase().includes(term)
      )
    );
  }

  // ✅ Pagination
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadStudents();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStudents();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadStudents();
  }

  // ✅ Sorting
  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadStudents();
  }

  // ✅ Change page size
  changePageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadStudents();
  }


  exportToCSV() {
  if (!this.filteredStudents.length) {
    alert("No data to export!");
    return;
  }

  // Define headers
  const headers = Object.keys(this.filteredStudents[0]);

  // Convert to CSV
  const csvRows = [
    headers.join(','), // header row
    ...this.filteredStudents.map((row: any) =>
      headers.map(h => `"${row[h] ?? ''}"`).join(',')
    )
  ];

  const csvData = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(csvData);

  // Download
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.href = url;
  a.download = 'students_export.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

editStudent(student: StudentSubmission) {
 this.router.navigate(['/dashboard/students/editSSC', student.id]);

}

openDeleteModal(id: number) {
  this.selectedUserId = id;
  this.selectedUserName = 'this Student'; // fallback text
  this.showDeleteModal = true;
}


cancelDelete() {
  this.showDeleteModal = false;
  this.selectedUserId = null;
  this.selectedUserName = '';
}


  // Confirm delete
  confirmDelete() {
    if (this.selectedUserId) {
      this.studentService.deleteStudent(this.selectedUserId).subscribe({
        next: () => {
          this.loadStudents();
          this.cancelDelete();
        },
        error: (err) => {
          this.error = err.message || "Delete failed";
          this.cancelDelete();
        }
      });
    }
  }
}
