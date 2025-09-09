import { Component } from '@angular/core';

@Component({
  selector: 'app-projects-react-springboot',
  imports: [],
  templateUrl: './projects-react-springboot.component.html',
  styleUrl: './projects-react-springboot.component.css'
})
export class ProjectsReactSpringbootComponent {
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
