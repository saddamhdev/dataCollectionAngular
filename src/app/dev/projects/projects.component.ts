import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  description: string;
  stack: string[];
  category: string; // angular-springboot, react-springboot, java
  demo?: string;
  live?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  selectedCategory: string = 'all';

  projects: Project[] = [
    {
      title: '📊 Attendance Tracker',
      description: 'JWT-secured attendance system with React & Spring Boot.',
      stack: ['React', 'Spring Boot', 'MongoDB'],
      category: 'react-springboot',
      live: 'https://attendance-demo.saddamh.dev',
      demo: 'DocUser.mp4'
    },
    {
      title: '🎓 Training App',
      description: 'Angular + Spring Boot platform for training, quizzes & feedback.',
      stack: ['Angular', 'Spring Boot', 'PostgreSQL'],
      category: 'angular-springboot',
      demo: 'DocUser.mp4'
    },
    {
      title: '💻 Device Management',
      description: 'Lifecycle system for inventory, warranty & services.',
      stack: ['Angular', 'Spring Boot', 'MySQL'],
      category: 'angular-springboot',
      demo: 'DocUser.mp4'
    },
    {
      title: '☕ Resume Tracker',
      description: 'Spring Boot + PostgreSQL system for managing job applications.',
      stack: ['Java', 'Spring Boot', 'PostgreSQL'],
      category: 'java'
    }
  ];

  get filteredProjects() {
    if (this.selectedCategory === 'all') return this.projects;
    return this.projects.filter(p => p.category === this.selectedCategory);
  }

  setCategory(cat: string) {
    this.selectedCategory = cat;
  }
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
