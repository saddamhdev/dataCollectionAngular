import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule
} from '@angular/forms';
import { StudentService } from '../../services/student/student.service';
import { ImageService } from '../../services/image.service';
import { LocationService } from '../../services/location.service';
import { Observable } from 'rxjs';
import { StudentSubmission } from '../../services/student/student.service';  
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-public-hsc-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './public-hsc-form.component.html',
  styleUrl: './public-hsc-form.component.css'
})
export class PublicHscFormComponent implements OnInit, OnDestroy {
  notice = signal<string | null>('Please fill all required fields (★).');
  noticeType = signal<'info' | 'success' | 'warning' | 'danger'>('info');

  sscImages: any[] = [];
  currentIndex = 0;
  intervalId: any;
  backendUrl = environment.baseUrl;
  showCongratsModal = false;   // 🎉 new modal toggle

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
  showValidationModal = false;
  missingFields: string[] = [];

closeModal() {
  this.showValidationModal = false;
}

  // Dropdown data
  locations: Record<string, Record<string, string[]>> = {};
  divisions: string[] = [];
  districts: string[] = [];
  upazilas: string[] = [];

  fileError = signal<string | null>(null);

  ngOnInit(): void {
  if (typeof window === 'undefined') return;
  // Load locations first
  this.locationService.getLocations().subscribe({
    next: (data) => {
      this.locations = data;
      this.divisions = Object.keys(data);
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
  if (this.form.invalid) {
    this.form.markAllAsTouched();

    this.missingFields = Object.keys(this.form.controls)
      .filter(k => this.form.get(k)?.invalid)
      .map(k => {
        switch (k) {
          case 'banglaName': return 'পূর্ণ নাম (বাংলা)';
          case 'englishName': return 'Full Name (English)';
          case 'sscRoll': return 'SSC Roll';
          case 'highSchool': return 'High School';
          case 'sscDept': return 'SSC Department';
          case 'sscResult': return 'SSC Result';
          case 'sscMark': return 'SSC Marks';
          case 'hscRoll': return 'HSC Roll';
          case 'college': return 'College';
          case 'hscDept': return 'HSC Department';
          case 'hscResult': return 'HSC Result';
          case 'hscMark': return 'HSC Marks';
          case 'division': return 'Division';
          case 'district': return 'District';
          case 'upazila': return 'Upazila';
          case 'target': return 'Professional Target';
          case 'email': return 'Email';
          case 'mobile': return 'Mobile';
          case 'guardianMobile': return 'Guardian Mobile';
          case 'agree': return 'Agreement Checkbox';
          default: return k;
        }
      });

    this.showValidationModal = true;
    return;
  }

  // ✅ Normal save/update (same as SSC)
  this.loading.set(true);
  this.success.set(false);
  this.error.set(null);
  try {
    if (this.studentId) {
      await this.api.updateStudent(this.studentId, this.form.value).toPromise();
    } else {
      await this.api.submitStudent(this.form.value, this.file);
    }
    this.success.set(true);
    this.form.reset({ agree: false });
    this.file = null;
    // 🎉 Show congratulations modal
    this.showCongratsModal = true;
  } catch (err: any) {
    console.error(err);
    this.error.set(err.message || 'Failed to submit.');
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

allowBanglaOnly(event: KeyboardEvent) {
  const pattern = /[\u0980-\u09FF\s]/;
  const inputChar = String.fromCharCode(event.charCode);
  if (!pattern.test(inputChar)) {
    event.preventDefault();
  }
}

allowOnlyNumbers(event: KeyboardEvent) {
  const pattern = /^[0-9]$/;
  const inputChar = String.fromCharCode(event.charCode);
  if (!pattern.test(inputChar)) {
    event.preventDefault();
  }
}

allowDecimal(event: KeyboardEvent) {
  const pattern = /[0-9.]/;
  const inputChar = String.fromCharCode(event.charCode);

  if (!pattern.test(inputChar)) {
    event.preventDefault();
  }

  const input = event.target as HTMLInputElement;
  if (input.value.includes('.') && inputChar === '.') {
    event.preventDefault();
  }
}
}