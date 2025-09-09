import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image.service';
import { FilterByBatchPipe } from '../../pipes/filter-by-batch.pipe';
import { PagePermissionService } from '../../services/page-permission.service';
import { ConfirmDeleteComponent } from '../shared/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-image-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterByBatchPipe, ConfirmDeleteComponent],
  templateUrl: './image-list.component.html',
  styleUrl: './image-list.component.css'
})
export class ImageListComponent implements OnInit {

   images: any[] = [];
 

  loading = true;
  error = '';
  backendUrl = 'http://localhost:8080'; // ⚡ change for AWS

  // Tabs
  activeTab: 'SSC' | 'HSC' = 'SSC';

  // Update modal
  selectedImage: any = null;
  showModal = false;

  // Delete modal
  deleteCandidate: any = null;
  showDeleteModal = false;
  studentToDelete: number | null = null;
selectedUserId: number | null = null;
selectedUserName = '';
  constructor(private imageService: ImageService, public pagePermissionService: PagePermissionService) {}

  ngOnInit(): void {
    this.imageService.getImages().subscribe({
      next: (res) => {
        this.images = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error loading images:', err);
        this.error = 'Failed to load images';
        this.loading = false;
      }
    });
  }

  // Tabs
  setTab(tab: 'SSC' | 'HSC') {
    this.activeTab = tab;
  }

  // Update
  onUpdate(img: any) {
    this.selectedImage = { ...img };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedImage = null;
  }

  saveUpdate() {
      if (!this.selectedImage) return;
      this.imageService.updateImage({
        id: this.selectedImage.id,
        batch: this.selectedImage.batch,
        status: this.selectedImage.status
      }).subscribe({
        next: (updated: any) => {
          const index = this.images.findIndex(i => i.id === updated.id);
          if (index !== -1) {
            // Replace immutably so Angular detects the change
            this.images = [
              ...this.images.slice(0, index),
              updated,
              ...this.images.slice(index + 1)
            ];
          }
          this.closeModal();
        },
        error: (err) => {
          console.error("❌ Update failed:", err);
          alert("Failed to update image");
        }
      });
}


// Open modal
openDeleteModal(id: number) {
  this.selectedUserId = id;
  this.selectedUserName = 'this Image'; // fallback text
  this.showDeleteModal = true;
}


cancelDelete() {
  this.showDeleteModal = false;
  this.selectedUserId = null;
  this.selectedUserName = '';
}

  confirmDelete() {
  if (this.selectedUserId) {
    this.imageService.deleteImage(this.selectedUserId).subscribe({
      next: () => {
        this.loadImages(); // reload from backend
        this.cancelDelete();
      },
      error: (err) => {
        console.error('❌ Delete failed:', err);
        this.error = err.message || "Delete failed";
        this.cancelDelete();
      }
    });
  }
}

// helper
loadImages() {
  this.imageService.getImages().subscribe({
    next: (res) => this.images = res,
    error: (err) => this.error = 'Failed to reload images'
  });
}


  
}
