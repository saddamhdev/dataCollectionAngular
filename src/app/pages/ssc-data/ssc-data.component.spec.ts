import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SscDataComponent } from './ssc-data.component';

describe('SscDataComponent', () => {
  let component: SscDataComponent;
  let fixture: ComponentFixture<SscDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SscDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SscDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
