import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  isModalOpen = false;
  currentVideo: string | null = null;
  currentYear = new Date().getFullYear();

  openDemo(video: string) {
    this.currentVideo = video;
    this.isModalOpen = true;
  }

  closeDemo() {
    this.isModalOpen = false;
    this.currentVideo = null;
  }
}
