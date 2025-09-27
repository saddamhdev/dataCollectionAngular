import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
})
export class ProjectFormComponent implements OnInit {
  projectForm!: FormGroup;
  private apiUrl = `${environment.baseUrl}/api/projects`;
  projectId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      title: this.fb.control('', { validators: Validators.required, nonNullable: true }),
      icon: this.fb.control('🎓', { nonNullable: true }),
      description: this.fb.control('', { nonNullable: true }),
      technologies: this.fb.array<FormControl<string>>([]),
      features: this.fb.array<FormControl<string>>([]),
      demoLinks: this.fb.array<FormGroup>([]),
    });

    // ✅ check if edit
    this.projectId = this.route.snapshot.paramMap.get('id');

 
    if (this.projectId) {
      
      this.loadProject(this.projectId);
    }
  }

  // -----------------------
  // Getters
  // -----------------------
  get technologies(): FormArray<FormControl<string>> {
    return this.projectForm.get('technologies') as FormArray<FormControl<string>>;
  }
  get features(): FormArray<FormControl<string>> {
    return this.projectForm.get('features') as FormArray<FormControl<string>>;
  }
  get demoLinks(): FormArray<FormGroup> {
    return this.projectForm.get('demoLinks') as FormArray<FormGroup>;
  }

  // -----------------------
  // Helpers
  // -----------------------
  private setFormArray(
    name: 'technologies' | 'features' | 'demoLinks',
    values: any[],
    isGroup = false
  ) {
    if (name === 'demoLinks') {
      const arr = this.fb.array<FormGroup>([]);
      values?.forEach((val) => {
        arr.push(
          this.fb.group({
            type: this.fb.control(val.type ?? '', { nonNullable: true }),
            url: this.fb.control(val.url ?? '', { nonNullable: true }),
          })
        );
      });
      this.projectForm.setControl(name, arr);
    } else {
      const arr = this.fb.array<FormControl<string>>([]);
      values?.forEach((val) =>
        arr.push(this.fb.control(val ?? '', { nonNullable: true }))
      );
      this.projectForm.setControl(name, arr);
    }
  }

 loadProject(id: string) {
  this.http.get<any>(`${this.apiUrl}/get/${id}`).subscribe({
    next: (p) => {
      console.log("📥 Loaded project:", p); // 👈 check structure

      this.projectForm.patchValue({
        title: p.title,
        icon: p.icon,
        description: p.description,
      });

      this.setFormArray('technologies', p.technologies);
      this.setFormArray('features', p.features);
      this.setFormArray('demoLinks', p.demoLinks, true);
    },
    error: (err) => console.error('❌ Failed to load project', err),
  });
}


  // -----------------------
  // Array methods
  // -----------------------
  addTechnology(tech: string) {
    if (tech.trim()) this.technologies.push(this.fb.control(tech, { nonNullable: true }));
  }
  removeTechnology(i: number) {
    this.technologies.removeAt(i);
  }

  addFeature(f: string) {
    if (f.trim()) this.features.push(this.fb.control(f, { nonNullable: true }));
  }
  removeFeature(i: number) {
    this.features.removeAt(i);
  }

  addDemoLink(type: string, url: string) {
    if (type.trim() && url.trim()) {
      this.demoLinks.push(
        this.fb.group({
          type: this.fb.control(type, { nonNullable: true }),
          url: this.fb.control(url, { nonNullable: true }),
        })
      );
    }
  }
  removeDemoLink(i: number) {
    this.demoLinks.removeAt(i);
  }

  // -----------------------
  // Submit
  // -----------------------
  onSubmit() {
    const project = this.projectForm.getRawValue();

    if (this.projectId) {
      // update
      this.http.post(`${this.apiUrl}/edit/${this.projectId}`, project).subscribe({
        next: () => {
          alert('✅ Project updated!');
          this.router.navigate(['/dev/project-list']);
        },
        error: (err) => {
          console.error(err);
          alert('❌ Error updating project');
        },
      });
    } else {
      // create new
      this.http.post(this.apiUrl, project).subscribe({
        next: () => {
          alert('✅ Project saved successfully!');
          this.projectForm.reset({ icon: '🎓' });
          this.projectForm.setControl('technologies', this.fb.array([]));
          this.projectForm.setControl('features', this.fb.array([]));
          this.projectForm.setControl('demoLinks', this.fb.array([]));
        },
        error: (err) => {
          console.error(err);
          alert('❌ Error saving project');
        },
      });
    }
  }
}
