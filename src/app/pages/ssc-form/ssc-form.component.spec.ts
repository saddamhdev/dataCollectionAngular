import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SscFormComponent } from './ssc-form.component';

describe('SscFormComponent', () => {
  let component: SscFormComponent;
  let fixture: ComponentFixture<SscFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SscFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SscFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
