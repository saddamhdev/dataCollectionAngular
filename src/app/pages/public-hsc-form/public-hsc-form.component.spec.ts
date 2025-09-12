import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicHscFormComponent } from './public-hsc-form.component';

describe('PublicHscFormComponent', () => {
  let component: PublicHscFormComponent;
  let fixture: ComponentFixture<PublicHscFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicHscFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicHscFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
