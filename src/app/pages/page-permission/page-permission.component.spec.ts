import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePermissionComponent } from './page-permission.component';

describe('PagePermissionComponent', () => {
  let component: PagePermissionComponent;
  let fixture: ComponentFixture<PagePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
