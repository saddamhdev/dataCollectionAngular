import { Component } from '@angular/core';

@Component({
  selector: 'app-case-studies',
  imports: [],
  templateUrl: './case-studies.component.html',
  styleUrl: './case-studies.component.css'
})
export class CaseStudiesComponent {
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
