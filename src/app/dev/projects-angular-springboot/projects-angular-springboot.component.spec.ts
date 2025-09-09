import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsAngularSpringbootComponent } from './projects-angular-springboot.component';

describe('ProjectsAngularSpringbootComponent', () => {
  let component: ProjectsAngularSpringbootComponent;
  let fixture: ComponentFixture<ProjectsAngularSpringbootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsAngularSpringbootComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsAngularSpringbootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
