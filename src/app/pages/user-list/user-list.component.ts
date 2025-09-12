import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { PagePermissionService } from '../../services/page-permission.service';
import { ConfirmDeleteComponent } from '../shared/confirm-delete/confirm-delete.component';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDeleteComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  error = '';

  // global search
  searchText = '';

  // sorting (default by name asc)
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  private router = inject(Router);
// track delete target
  // ✅ Modal state
  showDeleteModal = false;
  studentToDelete: number | null = null;
selectedUserId: number | null = null;
selectedUserName = '';
  constructor(private userService: UserService,public pagePermissionService: PagePermissionService  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (res: User[]) => {
        this.users = res;
        this.filteredUsers = [...this.users];
        this.applySorting(); // initial sorting
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Error loading users:', err);
        this.error = 'Failed to load users';
        this.loading = false;
      }
    });
  }

  // 🔍 Global Filtering
  applyFilter() {
    const search = this.searchText.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.userType.toLowerCase().includes(search)
    );
    this.applySorting();
  }

  // ⬆⬇ Sorting
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }

  applySorting() {
    if (!this.sortColumn) return;
    this.filteredUsers.sort((a: any, b: any) => {
      const valA = a[this.sortColumn]?.toString().toLowerCase();
      const valB = b[this.sortColumn]?.toString().toLowerCase();
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

 // user-list.component.ts
editUser(user: User) {
  this.userService.setSelectedUser(user);
  this.router.navigate(['/dashboard/users/edit']);
}



  openDeleteModal(id: number) {
  this.selectedUserId = id;
  this.selectedUserName = 'this user'; // fallback text
  this.showDeleteModal = true;
}


cancelDelete() {
  this.showDeleteModal = false;
  this.selectedUserId = null;
  this.selectedUserName = '';
}

confirmDelete() {
  if (this.selectedUserId) {
    this.userService.deleteUser(this.selectedUserId).subscribe({
      next: () => {
        // Remove deleted user from both arrays
        this.users = this.users.filter(u => u.id !== this.selectedUserId);
        this.filteredUsers = this.filteredUsers.filter(u => u.id !== this.selectedUserId);
        this.cancelDelete();
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.error = '❌ Failed to delete user';
        this.cancelDelete();
      }
    });
  }
}


}
