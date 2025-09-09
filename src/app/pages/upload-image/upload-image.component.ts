import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image.service';  // adjust path
import { PagePermissionService } from '../../services/page-permission.service';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent {
  batch: string = 'SSC';
  status: string = 'Active';
  imageFile: File | null = null;

  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  // ✅ Validation limits
  maxFileSize = 1 * 1024 * 1024 - 100; // 1MB - 100KB
  minWidth = 1100;
  minHeight = 200;
  maxWidth = 2000;
  maxHeight = 2000;

  constructor(private imageService: ImageService, public pagePermissionService: PagePermissionService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const f = input.files[0];

    // ✅ 1. Check file type
    if (!f.type.startsWith('image/')) {
      this.message = '❌ Only image files are allowed.';
      this.messageType = 'error';
      this.imageFile = null;
      return;
    }

    // ✅ 2. Check file size
    if (f.size > this.maxFileSize) {
      this.message = `❌ File too large. Max size is ${this.maxFileSize / (1024 * 1024)} MB.`;
      this.messageType = 'error';
      this.imageFile = null;
      return;
    }

    // ✅ 3. Check dimensions (async)
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        if (
          img.width < this.minWidth || img.height < this.minHeight ||
          img.width > this.maxWidth || img.height > this.maxHeight
        ) {
          this.message = `❌ Invalid dimensions. Allowed: ${this.minWidth}x${this.minHeight} up to ${this.maxWidth}x${this.maxHeight}.`;
          this.messageType = 'error';
          this.imageFile = null;
        } else {
          this.message = `✅ File ready: ${f.name} (${img.width}x${img.height})`;
          this.messageType = 'success';
          this.imageFile = f;
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(f);
  }

  onSubmit() {
    if (!this.imageFile) {
      this.message = '❌ Please select a valid image before uploading.';
      this.messageType = 'error';
      return;
    }

    this.imageService.uploadImage(this.batch, this.status, this.imageFile).subscribe({
      next: () => {
        this.message = '✅ Image uploaded successfully!';
        this.messageType = 'success';
        // reset form
        this.batch = 'SSC';
        this.status = 'Active';
        this.imageFile = null;
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.message = '❌ Upload failed. Try again.';
        this.messageType = 'error';
      }
    });
  }
}
