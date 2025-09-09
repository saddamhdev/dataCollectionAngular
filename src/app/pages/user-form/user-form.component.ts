import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { PagePermissionService } from '../../services/page-permission.service';
import { PagePermissionComponent } from '../page-permission/page-permission.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  user: User = {
    name: '',
    email: '',
    password: '',
    userType: 'Branch'
  };
loading = false;

  message: string = '';          // ✅ holds success/error text
  messageType: 'success' | 'error' | '' = ''; // ✅ helps style the message
showPassword: boolean = false;
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  constructor(private userService: UserService, public pagePermissionService: PagePermissionService) {}
ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); // 👈 read from URL
    if (id) {
      this.userService.getById(id).subscribe({
        next: (res: User) => {

          this.user = res;  // 👈 populate form
          this.user.password = ''; // clear password field
        },
        error: (err) => {
          console.error('❌ Error loading user:', err);
          this.message = '❌ Failed to load user for editing';
          this.messageType = 'error';
        }
      });
    }
  }

  onSubmit() {
    if (this.user.id) {
      // Update
      this.userService.updateUser(this.user.id, this.user).subscribe({
        next: (res: User) => {
          this.message = `✅ User "${res.name}" updated successfully!`;
          this.messageType = 'success';
        },
        error: (err: any) => {
          console.error('❌ Error updating user:', err);
          this.message = `❌ Failed to update user: ${err.error?.detail || 'Unexpected error'}`;
          this.messageType = 'error';
        }
      });
    }else {
        // Create
        this.userService.createUser(this.user).subscribe({
          next: (res: User) => {
            this.message = `✅ User "${res.name}" created successfully!`;
            this.messageType = 'success';
            this.user = { name: '', email: '', password: '', userType: 'Branch' };
          },
          error: (err: any) => {
            console.error('❌ Error saving user:', err);

            // If backend sends a plain string
            if (typeof err.error === 'string') {
              this.message = err.error; // e.g., "❌ Email already exists"
            }
            // If backend sends a JSON {detail: "..."}
            else if (err.error?.detail) {
              this.message = `❌ ${err.error.detail}`;
            }
            // Fallback
            else {
              this.message = `❌ Failed to save user: ${err.message || 'Unexpected error'}`;
            }

            this.messageType = 'error';
          }
        });
      }

  }
}
