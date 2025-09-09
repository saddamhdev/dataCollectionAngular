import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsReactSpringbootComponent } from './projects-react-springboot.component';

describe('ProjectsReactSpringbootComponent', () => {
  let component: ProjectsReactSpringbootComponent;
  let fixture: ComponentFixture<ProjectsReactSpringbootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsReactSpringbootComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsReactSpringbootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
