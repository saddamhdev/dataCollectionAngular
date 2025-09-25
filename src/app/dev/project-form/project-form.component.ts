import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  projectForm: any;
  private apiUrl = `${environment.baseUrl}/api/projects`;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      icon: ['🎓'],
      description: [''],
      technologies: this.fb.array([]),
      features: this.fb.array([]),
      demoLinks: this.fb.array([])
    });
  }

  get technologies() {
    return this.projectForm.get('technologies') as FormArray;
  }

  get features() {
    return this.projectForm.get('features') as FormArray;
  }

  get demoLinks() {
    return this.projectForm.get('demoLinks') as FormArray;
  }

  addTechnology(tech: string) {
    if (tech.trim()) {
      this.technologies.push(this.fb.control(tech));
    }
  }

  removeTechnology(i: number) {
    this.technologies.removeAt(i);
  }

  addFeature(f: string) {
    if (f.trim()) {
      this.features.push(this.fb.control(f));
    }
  }

  removeFeature(i: number) {
    this.features.removeAt(i);
  }

  addDemoLink(type: string, url: string) {
    if (type.trim() && url.trim()) {
      this.demoLinks.push(this.fb.group({
        type: [type],
        url: [url]
      }));
    }
  }

  removeDemoLink(i: number) {
    this.demoLinks.removeAt(i);
  }

  onSubmit() {
  const raw = this.projectForm.value;

  // ✅ ensure arrays are not null
  const project = {
    title: raw.title,
    icon: raw.icon,
    description: raw.description,
    technologies: raw.technologies || [],
    features: raw.features || [],
    demoLinks: raw.demoLinks || []
  };

  console.log("Submitting:", project);

  this.http.post(environment.baseUrl + '/api/projects', project)
    .subscribe({
      next: (res) => {
        alert('✅ Project saved successfully!');
        this.projectForm.reset();
        // reinitialize arrays so they don't become null
        this.projectForm.setControl('technologies', this.fb.array([]));
        this.projectForm.setControl('features', this.fb.array([]));
        this.projectForm.setControl('demoLinks', this.fb.array([]));
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error saving project');
      }
    });
}
}
