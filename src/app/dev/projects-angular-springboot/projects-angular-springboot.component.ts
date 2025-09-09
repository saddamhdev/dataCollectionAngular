import { Component } from '@angular/core';

@Component({
  selector: 'app-projects-angular-springboot',
  imports: [],
  templateUrl: './projects-angular-springboot.component.html',
  styleUrl: './projects-angular-springboot.component.css'
})
export class ProjectsAngularSpringbootComponent {
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
