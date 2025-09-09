import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule
} from '@angular/forms';
import { StudentService } from '../services/student/student.service';
import { ImageService } from '../services/image.service';
import { LocationService } from '../services/location.service';
import { Observable } from 'rxjs';
import { StudentSubmission } from '../services/student/student.service';  
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-student-submit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-submit.component.html',
  styleUrls: ['./student-submit.component.css'],
})
export class StudentSubmitComponent implements OnInit, OnDestroy {
  notice = signal<string | null>('Please fill all required fields (★).');
  noticeType = signal<'info' | 'success' | 'warning' | 'danger'>('info');

  sscImages: any[] = [];
  currentIndex = 0;
  intervalId: any;
  backendUrl = environment.baseUrl;

  private fb = inject(FormBuilder);
  private api = inject(StudentService);
  private imageService = inject(ImageService);
  private locationService = inject(LocationService);
  studentId: number | null = null; // holds edit id if present
  private router = inject(Router);
 private route = inject(ActivatedRoute);

  constructor(private StudentService: StudentService) {}

  form: FormGroup = this.fb.group({
    banglaName: ['', [Validators.required, Validators.minLength(3)]],
    englishName: ['', [Validators.required, Validators.minLength(3)]],
    sscRoll: ['', Validators.required],
    highSchool: ['', Validators.required],
    sscDept: ['', Validators.required],
    sscResult: ['', Validators.required],
    sscMark: ['', Validators.required],
    hscRoll: ['', Validators.required],
    college: ['', Validators.required],
    hscDept: ['', Validators.required],
    hscResult: ['', Validators.required],
    hscMark: ['', Validators.required],
    division: ['', Validators.required],
    district: ['', Validators.required],
    upazila: ['', Validators.required],
    target: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern(/^01[3-9]\d{8}$/)]],
    guardianMobile: ['', [Validators.required, Validators.pattern(/^01[3-9]\d{8}$/)]],
    email: ['', [Validators.required, Validators.email]],
    comments: [''],
    agree: [false, Validators.requiredTrue],
    status: ['ACTIVE']

  });

  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);
  private file: File | null = null;

  // Dropdown data
  locations: Record<string, Record<string, string[]>> = {};
  divisions: string[] = [];
  districts: string[] = [];
  upazilas: string[] = [];

  fileError = signal<string | null>(null);

  ngOnInit(): void {
  // Load locations first
  this.locationService.getLocations().subscribe({
    next: (data) => {
      this.locations = data;
      this.divisions = Object.keys(data);

      // ✅ Now safe to load student (locations exist)
      this.studentId = Number(this.route.snapshot.paramMap.get('id'));
      if (this.studentId) {
        this.loadStudent(this.studentId);
      }
    },
    error: (err) => console.error('❌ Failed to load locations:', err)
  });

  // Slideshow remains the same
  this.imageService.getImages().subscribe({
    next: (res) => {
      const activeImages = res.filter(i => i.batch === 'HSC' && i.status === 'Active');
      this.sscImages = activeImages.slice(0, 3);
      this.startSlideshow();
    },
    error: (err) => console.error('❌ Failed to load slideshow images:', err)
  });
}

loadStudent(id: number) {
    this.api.getById(id).subscribe({
      next: (data) => {
         console.log('Roll found:', data);
        if (data) {
          // ✅ Fill simple fields first
          this.form.patchValue({
            banglaName: data.banglaName,
            englishName: data.englishName,
            highSchool: data.highSchool,
            sscRoll: data.sscRoll,
            sscDept: data.sscDept,
            sscResult: data.sscResult,
            sscMark: data.sscMark,
            hscRoll: data.hscRoll,
            college: data.college,
            hscDept: data.hscDept,
            hscResult: data.hscResult,
            hscMark: data.hscMark,
            target: data.target,
            email: data.email,
            mobile: data.mobile,
            guardianMobile: data.guardianMobile,
            comments: data.comments,
            agree: data.agree
          });

          // ✅ Handle location fields with dependency
          if (data.division) {
            this.form.patchValue({ division: data.division });
            this.onDivisionChange(); // load districts

            if (data.district) {
              this.form.patchValue({ district: data.district });
              this.onDistrictChange(); // load upazilas

              if (data.upazila) {
                this.form.patchValue({ upazila: data.upazila });
              }
            }
          }
        }
      },
      error: (err) => {
        console.error('❌ Failed to load student:', err);
      }
    });
  }
  startSlideshow() {
    if (this.sscImages.length > 0) {
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.sscImages.length;
      }, 2000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  onDivisionChange() {
  const division = this.form.get('division')?.value;
  this.districts = division ? Object.keys(this.locations[division]).sort() : [];
  this.upazilas = [];
  this.form.patchValue({ district: '', upazila: '' });
}

onDistrictChange() {
  const division = this.form.get('division')?.value;
  const district = this.form.get('district')?.value;
  this.upazilas = division && district
    ? [...this.locations[division][district]].sort()
    : [];
  this.form.patchValue({ upazila: '' });
}

  t(path: string) {
    return this.form.get(path);
  }

  onFile(ev: Event) {
    this.fileError.set(null);
    const input = ev.target as HTMLInputElement;
    const f = input.files && input.files[0];
    if (!f) { this.file = null; return; }
    if (f.type !== 'application/pdf') {
      this.fileError.set('Only PDF allowed.');
      this.file = null;
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      this.fileError.set('File too large (max 2MB).');
      this.file = null;
      return;
    }
    this.file = f;
  }

async onSubmit() {
  console.log('Form Data:', this.form.value);
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  this.loading.set(true);
  this.success.set(false);
  this.error.set(null);

  try {
    if (this.studentId) {
      // 🔄 UPDATE
      await this.api.updateStudent(this.studentId, this.form.value).toPromise();
    } else {
      // 🆕 CREATE
      await this.api.submitStudent(this.form.value, this.file);
    }

    this.success.set(true);
    this.form.reset({ agree: false });
    this.file = null;
  } catch (err: any) {
    if (err.status === 200 || err.status === 201) {
      this.success.set(true);
      this.form.reset({ agree: false });
      this.file = null;
      return;
    }

    const pd = (err.error ?? {}) as {
      detail?: string;
      errors?: Array<{ field?: string; message?: string }>;
    };
    const list = Array.isArray(pd.errors) ? pd.errors : [];
    list.forEach(({ field, message }) => {
      const c = field ? this.form.get(field) : null;
      if (c) c.setErrors({ ...(c.errors || {}), server: message });
    });
    this.error.set(
      list.length
        ? list.map(e => (e.field ? `${e.field}: ${e.message}` : e.message)).join(', ')
        : (pd.detail || err.message || `Request failed (${err.status}).`)
    );
  } finally {
    this.loading.set(false);
  }
}

checkSscRoll() {
  const roll = this.form.get('sscRoll')?.value;
  if (roll) {
    this.StudentService.getBySscRoll(roll).subscribe({
      next: (data) => {
       console.log('Roll found:', data);
        if (data) {
          // ✅ Fill simple fields first
          this.form.patchValue({
            banglaName: data.banglaName,
            englishName: data.englishName,
            highSchool: data.highSchool,
            sscDept: data.sscDept,
            sscResult: data.sscResult,
            sscMark: data.sscMark,
            hscRoll: data.hscRoll,
            college: data.college,
            hscDept: data.hscDept,
            hscResult: data.hscResult,
            hscMark: data.hscMark,
            target: data.target,
            email: data.email,
            mobile: '',
            guardianMobile: '',
            comments: data.comments,
            agree: data.agree
          });

          // ✅ Handle location fields with dependency
          if (data.division) {
            this.form.patchValue({ division: data.division });
            this.onDivisionChange(); // load districts

            if (data.district) {
              this.form.patchValue({ district: data.district });
              this.onDistrictChange(); // load upazilas

              if (data.upazila) {
                this.form.patchValue({ upazila: data.upazila });
              }
            }
          }
        }
      },
      error: (err) => {
        console.log('Roll not found or error:', err);
      }
    });
  }
}

}
