import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements OnInit {
  project: any;
  otherProjects: any[] = [];
  youtubeUrl: SafeResourceUrl | null = null;

  private apiUrl = `${environment.baseUrl}/api/projects`;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const title = params.get('title');
      if (title) {
        console.log('📌 Loading project with title:', title);

        this.http.get<any>(`${this.apiUrl}/${title}`).subscribe(res => {
          this.project = res;
          console.log('📦 Project loaded from backend:', this.project);

          // ✅ Extract YouTube link
          const yt = this.project.demoLinks?.find((l: any) => l.type === 'YouTube');
          if (yt) {
            const id = this.extractYoutubeId(yt.url);
            console.log('🎥 Raw YouTube URL from backend:', yt.url);
            console.log('🎥 Extracted YouTube ID:', id);

            if (id) {
              this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                `https://www.youtube.com/embed/${id}`
              );
              console.log('✅ Final safe YouTube embed URL:', this.youtubeUrl);
            } else {
              console.warn('⚠️ Could not extract YouTube ID, skipping embed');
              this.youtubeUrl = null;
            }
          } else {
            console.warn('⚠️ No YouTube link found in demoLinks:', this.project.demoLinks);
            this.youtubeUrl = null;
          }
        });
      }

      // Load all other projects
      this.http.get<any[]>(this.apiUrl).subscribe(res => {
        if (title) {
          this.otherProjects = res.filter(p => p.title !== title);
        } else {
          this.otherProjects = res;
        }
        console.log('📚 Other projects loaded:', this.otherProjects);
      });
    });
  }

  private extractYoutubeId(url: string): string {
    if (!url) return '';
    console.log('🔍 Extracting ID from:', url);

    try {
      const urlObj = new URL(url);

      // Handle ?v= param
      if (urlObj.searchParams.get('v')) {
        console.log('✅ Found v param:', urlObj.searchParams.get('v'));
        return urlObj.searchParams.get('v')!;
      }

      // Handle youtu.be short links
      if (urlObj.hostname === 'youtu.be') {
        const shortId = urlObj.pathname.substring(1);
        console.log('✅ Found short link ID:', shortId);
        return shortId;
      }

      // Handle /embed/ or /shorts/
      const pathParts = urlObj.pathname.split('/');
      if (pathParts.includes('embed') || pathParts.includes('shorts')) {
        const embedId = pathParts[pathParts.length - 1];
        console.log('✅ Found embed/shorts ID:', embedId);
        return embedId;
      }

      console.warn('❌ No YouTube ID found for URL:', url);
      return '';
    } catch (e) {
      console.error('❌ Invalid YouTube URL:', url, e);
      return '';
    }
  }
}
