import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagePermissionService } from '../../services/page-permission.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isOpen = true; // Sidebar expanded by default
studentOpen = false;
userOpen = false;
permissionOpen = false;
imageOpen = false;
openMenu: string | null = null;
constructor(public pagePermissionService: PagePermissionService,public authService: AuthService, private router: Router) {}

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  toggleMenu(menu: string) {
    this.openMenu = this.openMenu === menu ? null : menu;
  }
logout() {
    this.authService.logout(); // clears token
    this.router.navigate(['/']); // redirect to login
  }
}
