import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsJavaComponent } from './projects-java.component';

describe('ProjectsJavaComponent', () => {
  let component: ProjectsJavaComponent;
  let fixture: ComponentFixture<ProjectsJavaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsJavaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsJavaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
