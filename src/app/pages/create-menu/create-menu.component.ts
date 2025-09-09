import { Component, OnInit } from '@angular/core';
import { Menu, MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagePermissionService } from '../../services/page-permission.service';
import { ConfirmDeleteComponent } from '../shared/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-create-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDeleteComponent],
  templateUrl: './create-menu.component.html',
  styleUrls: ['./create-menu.component.css']
})
export class CreateMenuComponent implements OnInit {
  menuName: string = '';
  menus: Menu[] = [];
 selectedUserId: number | null = null;
  selectedUserName: string = '';
  showDeleteModal = false;
  constructor(private menuService: MenuService, public pagePermissionService: PagePermissionService) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus() {
    this.menuService.getMenus().subscribe(data => {
     // ✅ Sort alphabetically by menuName
    this.menus = data.sort((a: any, b: any) => 
      a.name.localeCompare(b.name)
    );
    });
  }

  addMenu() {
    if (!this.menuName.trim()) {
      alert('Menu Name is required!');
      return;
    }

    this.menuService.addMenu({ name: this.menuName }).subscribe(() => {
      this.menuName = '';
      this.loadMenus();
    });
  }
  openDeleteModal(id: number) {
  this.selectedUserId = id;
  this.selectedUserName = 'this Menu'; // fallback text
  this.showDeleteModal = true;
}


cancelDelete() {
  this.showDeleteModal = false;
  this.selectedUserId = null;
  this.selectedUserName = '';
}


      confirmDelete() {
      if (this.selectedUserId) {
        this.menuService.deleteMenu(this.selectedUserId).subscribe({
          next: () => {
            this.loadMenus();
            this.cancelDelete();
          },
          error: (err) => {
            // Show backend error directly if available
            if (err.status === 409 && err.error) {
              alert(err.error); // "❌ Cannot delete menu because it has linked components."
            } else {
              alert(err.message || "Delete failed");
            }
            this.cancelDelete();
          }
        });
      }
    }
  
}
