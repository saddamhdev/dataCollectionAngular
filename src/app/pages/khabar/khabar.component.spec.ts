import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhabarComponent } from './khabar.component';

describe('KhabarComponent', () => {
  let component: KhabarComponent;
  let fixture: ComponentFixture<KhabarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhabarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhabarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
