import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThanaPermissionService } from '../../services/thana-permission.service';
import { UserService } from '../../services/user.service';
import { LocationService } from '../../services/location.service';
import { PagePermissionService } from '../../services/page-permission.service';

@Component({
  selector: 'app-thana-permission',
  standalone: true, // ✅ standalone component
  imports: [CommonModule, FormsModule], // ✅ gives *ngIf, *ngFor, ngModel, ngValue
  templateUrl: './thana-permission.component.html',
  styleUrls: ['./thana-permission.component.css'],
})
export class ThanaPermissionComponent implements OnInit {
  users: any[] = [];
  divisions: string[] = [];
  districts: string[] = [];
  thanas: { name: string; selected: boolean }[] = []; // ✅ initialized as []
  isUpdateMode: boolean = false; // ✅ to toggle button text
  selectedUser: any = null;
  selectedDivision: string | null = null;
  selectedDistrict: string | null = null;

  locations: Record<string, Record<string, string[]>> = {};

  constructor(
    private thanaService: ThanaPermissionService,
    private userService: UserService,
    private locationService: LocationService,
    public pagePermissionService: PagePermissionService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadDivisions();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data) => (this.users = data));
  }

  loadDivisions() {
    this.locationService.getLocations().subscribe({
      next: (data) => {
        this.locations = data;
        this.divisions = Object.keys(data);
      },
      error: (err) => console.error('❌ Failed to load locations:', err),
    });
  }

  loadDistricts() {
    if (!this.selectedDivision) return;
    this.districts = Object.keys(this.locations[this.selectedDivision]);
    this.selectedDistrict = null;
    this.thanas = [];
  }

loadThanas() {
  if (!this.selectedDivision || !this.selectedDistrict || !this.selectedUser) return;

  const thanaList = this.locations[this.selectedDivision][this.selectedDistrict] || [];
  this.thanas = thanaList.map((t) => ({ name: t, selected: false }));

  // ✅ check DB if user already has permissions
  this.thanaService.getPermissions(this.selectedUser.id, this.selectedDivision, this.selectedDistrict)
    .subscribe(existing => {
      if (existing && existing.thanaNames) {
        // Mark saved thanas
        this.thanas.forEach(t => {
          if (existing.thanaNames.includes(t.name)) {
            t.selected = true;
          }
        });
        this.isUpdateMode = true;  // flag to change button text
      } else {
        this.isUpdateMode = false;
      }
    });
}

get isSaveDisabled(): boolean {
  if (!this.selectedUser) return true;
  if (!this.thanas) return true;
  return this.thanas.filter(t => t.selected).length === 0;
}

  savePermissions() {
    if (!this.selectedUser) {
      alert('⚠ Please select a user first!');
      return;
    }

    const selectedThanas = this.thanas
      .filter((t) => t.selected)
      .map((t) => t.name);

    const payload = {
      division: this.selectedDivision,
      district: this.selectedDistrict,
      thanaNames: selectedThanas,
    };

    this.thanaService
      .savePermissions(this.selectedUser.id, payload)
      .subscribe(() => {
        alert('✅ Permissions saved successfully!');
      });
  }
}
