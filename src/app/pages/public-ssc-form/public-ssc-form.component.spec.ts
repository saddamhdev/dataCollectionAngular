import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicSscFormComponent } from './public-ssc-form.component';

describe('PublicSscFormComponent', () => {
  let component: PublicSscFormComponent;
  let fixture: ComponentFixture<PublicSscFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicSscFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicSscFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
