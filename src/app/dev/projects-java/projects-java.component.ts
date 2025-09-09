import { Component } from '@angular/core';

@Component({
  selector: 'app-projects-java',
  imports: [],
  templateUrl: './projects-java.component.html',
  styleUrl: './projects-java.component.css'
})
export class ProjectsJavaComponent {
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
