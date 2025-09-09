import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserPermissionListComponent } from './app-user-permission-list.component';

describe('AppUserPermissionListComponent', () => {
  let component: AppUserPermissionListComponent;
  let fixture: ComponentFixture<AppUserPermissionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppUserPermissionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppUserPermissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
