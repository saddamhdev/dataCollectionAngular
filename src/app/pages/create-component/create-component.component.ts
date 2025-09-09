import { Component, OnInit } from '@angular/core';
import { Menu, MenuService } from '../../services/menu.service';
import { Page, PageService } from '../../services/page.service';
import { ComponentService, ComponentItem } from '../../services/component.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagePermissionService } from '../../services/page-permission.service';
import { ConfirmDeleteComponent } from '../shared/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-create-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDeleteComponent],
  templateUrl: './create-component.component.html',
  styleUrls: ['./create-component.component.css']
})
export class CreateComponentComponent implements OnInit {
  componentName: string = '';
  selectedMenuId: number | null = null;
  selectedPageId: number | null = null;

  menus: Menu[] = [];
  pages: Page[] = [];
  filteredPages: Page[] = [];
  components: ComponentItem[] = [];
  selectedUserId: number | null = null;
  selectedUserName: string = '';
  showDeleteModal = false;

  constructor(
    private menuService: MenuService,
    private pageService: PageService,
    private componentService: ComponentService,
    public pagePermissionService: PagePermissionService
  ) {}

  ngOnInit(): void {
    this.loadMenus();
    this.loadPages();
    this.loadComponents();
  }

  loadMenus() {
    this.menuService.getMenus().subscribe(data => (this.menus = data));
  }

  loadPages() {
    this.pageService.getPages().subscribe(data => {
      this.pages = data;
      this.filterPages();
    });
  }

loadComponents() {
  this.componentService.getComponents().subscribe(data => {
    // ✅ Sort alphabetically by menuName
    this.components = data.sort((a: any, b: any) => 
      a.menuName.localeCompare(b.menuName)
    );

    // For descending order:
    // this.components = data.sort((a: any, b: any) => 
    //   b.menuName.localeCompare(a.menuName)
    // );
  });
}

  filterPages() {
  if (this.selectedMenuId) {
    // Since Page DTO has only menuName, match against menus list
    const selectedMenu = this.menus.find(m => m.id === this.selectedMenuId);
    if (selectedMenu) {
      this.filteredPages = this.pages.filter(p => p.menuName === selectedMenu.name);
    } else {
      this.filteredPages = [];
    }
  } else {
    this.filteredPages = [];
  }
}


  addComponent() {
    if (!this.componentName.trim() || !this.selectedPageId) {
      alert('Component Name and Page selection are required!');
      return;
    }

    this.componentService.addComponent({ name: this.componentName, pageId: this.selectedPageId }).subscribe(() => {
      this.componentName = '';
      this.selectedMenuId = null;
      this.selectedPageId = null;
      this.loadComponents();
    });
  }
  openDeleteModal(id: number) {
  this.selectedUserId = id;
  this.selectedUserName = 'this Component'; // fallback text
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
      this.componentService.deleteComponent(this.selectedUserId).subscribe({
        next: () => {
          this.loadComponents();
          this.cancelDelete();
        },
        error: (err) => {
          // this.error = err.message || "Delete failed";
          this.cancelDelete();
        }
      });
    }
  }

}
