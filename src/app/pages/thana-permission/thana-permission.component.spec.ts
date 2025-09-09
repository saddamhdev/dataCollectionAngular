import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanaPermissionComponent } from './thana-permission.component';

describe('ThanaPermissionComponent', () => {
  let component: ThanaPermissionComponent;
  let fixture: ComponentFixture<ThanaPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThanaPermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThanaPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
