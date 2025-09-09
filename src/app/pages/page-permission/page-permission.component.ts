import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../../services/user.service';
import { FilterGlobalPipe } from '../../pipes/filter-global.pipe';

import {
  PagePermissionService,
  TreePermissionResponse,
  MenuSelection,
  PageSelection,
  ComponentSelection
} from '../../services/page-permission.service';

@Component({
  selector: 'app-page-permission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './page-permission.component.html',
  styleUrls: ['./page-permission.component.css']
})
export class PagePermissionComponent implements OnInit {
    searchText = ''; // ✅ for global filter binding
    allUserPermissions: TreePermissionResponse[] = [];
    filteredUserPermissions: TreePermissionResponse[] = [];
    users: User[] = [];
    selectedUserId: number | null = null;
   tree: TreePermissionResponse | null = null;

  hasExistingPermissions: boolean = false;
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;


  constructor(
    private userService: UserService,
    private permissionService: PagePermissionService,
    public pagePermissionService: PagePermissionService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadAllPermissions();  // 🔹 load all user permissions at start
  }
loadAllPermissions() {
  this.permissionService.getAllPermissions().subscribe(data => {
  this.allUserPermissions = data;
  this.applyFilter();
});

}


  loadUsers() {
    this.userService.getUsers().subscribe(d => (this.users = d));
  }

  loadUserPermissions(userId: number) {
  this.permissionService.getPermissionsByUser(userId).subscribe(data => {
    console.log('Loaded permissions for user', userId, data);
    this.tree = data;

    // ✅ if the backend returned menus and at least one checked item, mark as update
    this.hasExistingPermissions = data.menus.some(
      m => m.checked || m.pages.some(p => p.checked || p.components.some(c => c.checked))
    );
  });
}

  // --- Helpers for indeterminate ---
  isPageIndeterminate(page: PageSelection): boolean {
    const checkedCount = page.components.filter(c => c.checked).length;
    return checkedCount > 0 && checkedCount < page.components.length;
  }

  isMenuIndeterminate(menu: MenuSelection): boolean {
    const checkedPages = menu.pages.filter(p => p.checked || this.isPageIndeterminate(p));
    return checkedPages.length > 0 && checkedPages.length < menu.pages.length;
  }

  // --- Toggle logic ---
  toggleMenu(menu: MenuSelection) {
    menu.checked = !menu.checked;
    menu.pages.forEach(p => {
      p.checked = menu.checked;
      p.components.forEach(c => (c.checked = menu.checked));
    });
  }

  togglePage(menu: MenuSelection, page: PageSelection) {
    page.checked = !page.checked;
    page.components.forEach(c => (c.checked = page.checked));

    // update menu based on all pages
    menu.checked = menu.pages.every(p => p.checked);
  }

  toggleComponent(menu: MenuSelection, page: PageSelection, comp: ComponentSelection) {
    comp.checked = !comp.checked;

    // update page
    page.checked = page.components.every(c => c.checked);

    // update menu
    menu.checked = menu.pages.every(p => p.checked);
  }

  // --- Save ---
 savePermissions() {
  if (!this.tree) {
    this.showMessage('No data to save', 'error');
    return;
  }

  console.log('🚀 Sending Tree Payload:', this.tree);

  const action = this.hasExistingPermissions ? 'Update' : 'Save';

  this.permissionService.assignTreePermissions(this.tree).subscribe({
    next: () => {
      this.showMessage(`${action} completed successfully ✅`, 'success');
      this.loadUserPermissions(this.tree!.userId);
    },
    error: (err) => {
      console.error(err);
      this.showMessage(`${action} failed ❌`, 'error');
    }
  });

  this.permissionService.assignTreePermissions(this.tree).subscribe(() => {
  this.showMessage(`${action} completed successfully ✅`, 'success');
  this.loadUserPermissions(this.tree!.userId);
  this.loadAllPermissions();  // 🔄 refresh table
});

}
private showMessage(text: string, type: 'success' | 'error' = 'success') {
  this.message = text;
  this.messageType = type;

  // auto-hide after 3 seconds
  setTimeout(() => {
    this.message = null;
    this.messageType = null;
  }, 3000);
}

applyFilter() {
  const search = this.searchText.toLowerCase().trim();

  if (!search) {
    this.filteredUserPermissions = [...this.allUserPermissions];
    return;
  }

  this.filteredUserPermissions = this.allUserPermissions
    .map(user => {
      const userMatch =
        user.userName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);

      // If user matches → return full user with ALL menus/pages/components
      if (userMatch) {
        return { ...user };
      }

      // Otherwise filter deeper
      const filteredMenus = user.menus
        .map(menu => {
          const menuMatch = menu.name.toLowerCase().includes(search);

          if (menuMatch) {
            // Keep full menu if it matches
            return { ...menu };
          }

          const filteredPages = menu.pages
            .map(page => {
              const pageMatch = page.name.toLowerCase().includes(search);

              if (pageMatch) {
                // Keep full page if it matches
                return { ...page };
              }

              const filteredComponents = page.components.filter(comp =>
                comp.name.toLowerCase().includes(search)
              );

              return filteredComponents.length > 0
                ? { ...page, components: filteredComponents }
                : null;
            })
            .filter(p => p !== null) as typeof menu.pages;

          return filteredPages.length > 0
            ? { ...menu, pages: filteredPages }
            : null;
        })
        .filter(m => m !== null) as typeof user.menus;

      return filteredMenus.length > 0
        ? { ...user, menus: filteredMenus }
        : null;
    })
    .filter(u => u !== null) as typeof this.allUserPermissions;
}
}