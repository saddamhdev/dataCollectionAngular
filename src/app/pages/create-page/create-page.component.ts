import { Component, OnInit } from '@angular/core';
import { Menu, MenuService } from '../../services/menu.service';
import { Page, PageService } from '../../services/page.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagePermissionService } from '../../services/page-permission.service';
import { ConfirmDeleteComponent } from '../shared/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDeleteComponent],
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.css']
})
export class CreatePageComponent implements OnInit {
  pageName: string = '';
  selectedMenuId: number | null = null;

  menus: Menu[] = [];
  pages: Page[] = [];
 selectedUserId: number | null = null;
  selectedUserName: string = '';
  showDeleteModal = false;
  constructor(private menuService: MenuService, private pageService: PageService, public pagePermissionService: PagePermissionService) {}

  ngOnInit(): void {
    this.loadMenus();
    this.loadPages();
  }

  loadMenus() {
    this.menuService.getMenus().subscribe(data => {
      this.menus = data;
    });
  }

  loadPages() {
    this.pageService.getPages().subscribe(data => {
       // ✅ Sort alphabetically by menuName
    this.pages = data.sort((a: any, b: any) => 
      a.menuName.localeCompare(b.menuName)
    );
    });
  }

  addPage() {
    if (!this.pageName.trim() || !this.selectedMenuId) {
      alert('Page Name and Menu selection are required!');
      return;
    }

    this.pageService.addPage({ name: this.pageName, menuId: this.selectedMenuId }).subscribe(() => {
      this.pageName = '';
      this.selectedMenuId = null;
      this.loadPages();
    });
  }
  openDeleteModal(id: number) {
  this.selectedUserId = id;
  this.selectedUserName = 'this Page'; // fallback text
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
    this.pageService.deletePage(this.selectedUserId).subscribe({
      next: () => {
        this.loadPages();
        this.cancelDelete();
      },
      error: (err) => {
        // Show backend error directly if available
        if (err.status === 409 && err.error) {
          alert(err.error); // "❌ Cannot delete page because it has linked components."
        } else {
          alert(err.message || "Delete failed");
        }
        this.cancelDelete();
      }
    });
  }
}


}
