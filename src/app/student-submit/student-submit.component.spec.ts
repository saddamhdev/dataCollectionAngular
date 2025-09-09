import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSubmitComponent } from './student-submit.component';

describe('StudentSubmitComponent', () => {
  let component: StudentSubmitComponent;
  let fixture: ComponentFixture<StudentSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSubmitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
