import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  projects: any[] = [];
  private apiUrl = `${environment.baseUrl}/api/projects`;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => this.projects = res,
      error: (err) => console.error("❌ Failed to load projects", err)
    });
  }

  editProject(id: string) {
   
    this.router.navigate(['/projects/edit', id]);
  }

  deleteProject(id: string) {
    alert("🗑 Delete project ID: " + id);
  if (!confirm("⚠ Are you sure you want to delete this project?")) return;

  // ✅ Use POST because backend expects POST /delete/{id}
  this.http.post(`${this.apiUrl}/delete/${id}`, {}).subscribe({
    next: () => {
      alert("🗑 Project deleted!");
      this.projects = this.projects.filter(p => p.id !== id);
    },
    error: (err) => {
      console.error(err);
      alert("❌ Error deleting project");
    }
  });
}


  // ✅ trackBy function
  trackById(index: number, item: any): string {
    return item.id; // if backend uses "_id", change to item._id
  }
}
