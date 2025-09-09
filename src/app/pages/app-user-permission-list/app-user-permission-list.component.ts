import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterGlobalPipe } from '../../pipes/filter-global.pipe';
import { ThanaPermissionService } from '../../services/thana-permission.service';
import { PagePermissionService } from '../../services/page-permission.service';

@Component({
  selector: 'app-user-permission-list',
  standalone: true, // ✅ standalone component
  imports: [CommonModule, FormsModule, FilterGlobalPipe], 
  templateUrl: './app-user-permission-list.component.html',
  styleUrls: ['./app-user-permission-list.component.css'] // ✅ fixed plural
})
export class UserPermissionListComponent implements OnInit {
  userPermissions: any[] = [];
  searchText = ''; // ✅ for global filter binding

  constructor(private thanaPermissionService: ThanaPermissionService, private pagePermissionService: PagePermissionService) {} // ✅ lowerCamelCase

  ngOnInit(): void {
    this.thanaPermissionService.getUserPermissions().subscribe({
      next: (data) => (this.userPermissions = data),
      error: (err) => console.error('❌ Failed to load user permissions:', err),
    });
  }
}
