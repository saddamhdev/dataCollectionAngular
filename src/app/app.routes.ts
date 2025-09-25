import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  // Public
  {
    path: '',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    pathMatch: 'full',
  },
  {
    path: 'khabar',
    loadComponent: () =>
      import('./pages/khabar/khabar.component').then((m) => m.KhabarComponent),
  },

  // Private (Dashboard + children)
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./layout/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'data',
        loadComponent: () =>
          import('./pages/data/data.component').then((m) => m.DataComponent),
      },
      {
        path: 'sscData',
        loadComponent: () =>
          import('./pages/ssc-data/ssc-data.component').then(
            (m) => m.SscDataComponent
          ),
      },
      {
        path: 'userForm',
        loadComponent: () =>
          import('./pages/user-form/user-form.component').then(
            (m) => m.UserFormComponent
          ),
      },
      {
        path: 'userList',
        loadComponent: () =>
          import('./pages/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
      },
      {
        path: 'uploadImage',
        loadComponent: () =>
          import('./pages/upload-image/upload-image.component').then(
            (m) => m.UploadImageComponent
          ),
      },
      {
        path: 'imageList',
        loadComponent: () =>
          import('./pages/image-list/image-list.component').then(
            (m) => m.ImageListComponent
          ),
      },
      {
        path: 'thanaPermission',
        loadComponent: () =>
          import('./pages/thana-permission/thana-permission.component').then(
            (m) => m.ThanaPermissionComponent
          ),
      },
      {
        path: 'userPermissions',
        loadComponent: () =>
          import(
            './pages/app-user-permission-list/app-user-permission-list.component'
          ).then((m) => m.UserPermissionListComponent),
      },
      {
        path: 'createMenu',
        loadComponent: () =>
          import('./pages/create-menu/create-menu.component').then(
            (m) => m.CreateMenuComponent
          ),
      },
      {
        path: 'createPage',
        loadComponent: () =>
          import('./pages/create-page/create-page.component').then(
            (m) => m.CreatePageComponent
          ),
      },
      {
        path: 'createComponent',
        loadComponent: () =>
          import('./pages/create-component/create-component.component').then(
            (m) => m.CreateComponentComponent
          ),
      },
      {
        path: 'pagePermission',
        loadComponent: () =>
          import('./pages/page-permission/page-permission.component').then(
            (m) => m.PagePermissionComponent
          ),
      },
      {
        path: 'hscForm',
        loadComponent: () =>
          import('./student-submit/student-submit.component').then(
            (m) => m.StudentSubmitComponent
          ),
      },
      {
        path: 'sscForm',
        loadComponent: () =>
          import('./pages/ssc-form/ssc-form.component').then(
            (m) => m.SscFormComponent
          ),
      },

      // ⚡ Dynamic edit routes marked client-only
       {
        path: 'students/editSSC',
        loadComponent: () =>
          import('./pages/ssc-form/ssc-form.component').then(
            (m) => m.SscFormComponent
          ),
      },
      
      {
        path: 'students/editHSC',
        loadComponent: () =>
          import('./student-submit/student-submit.component').then(
            (m) => m.StudentSubmitComponent
          ),
      },
      
      {
        path: 'users/edit',
        loadComponent: () =>
          import('./pages/user-form/user-form.component').then(
            (m) => m.UserFormComponent
          ),
      }, 
    ],
  },

  // Other demo/dev routes
  {
    path: 'data',
    loadComponent: () =>
      import('./pages/data/data.component').then((m) => m.DataComponent),
  },
  {
    path: 'dev/home',
    loadComponent: () =>
      import('./dev/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'dev/projects',
    loadComponent: () =>
      import('./dev/projects/projects.component').then(
        (m) => m.ProjectsComponent
      ),
  },
  {
    path: 'dev/case-studies',
    loadComponent: () =>
      import('./dev/case-studies/case-studies.component').then(
        (m) => m.CaseStudiesComponent
      ),
  },
  {
    path: 'dev/projects-angular-springboot',
    loadComponent: () =>
      import(
        './dev/projects-angular-springboot/projects-angular-springboot.component'
      ).then((m) => m.ProjectsAngularSpringbootComponent),
  },
  {
    path: 'dev/projects-react-springboot',
    loadComponent: () =>
      import(
        './dev/projects-react-springboot/projects-react-springboot.component'
      ).then((m) => m.ProjectsReactSpringbootComponent),
  },
  {
    path: 'dev/projects-java',
    loadComponent: () =>
      import('./dev/projects-java/projects-java.component').then(
        (m) => m.ProjectsJavaComponent
      ),
  },
  {
    path:'sscform',
    loadComponent: () =>
      import('./pages/public-ssc-form/public-ssc-form.component').then(
        (m) => m.PublicSscFormComponent
      ),
  },
  {
    path: 'hscform',
    loadComponent: () =>
      import('./pages/public-hsc-form/public-hsc-form.component').then(
        (m) => m.PublicHscFormComponent
      ),
  },
  {
    path: 'dev/project-form',
    loadComponent: () =>
      import('./dev/project-form/project-form.component').then(
        (m) => m.ProjectFormComponent
      ),
  },
  {
    path: 'dev/project-list',
    loadComponent: () =>
      import('./dev/project-list/project-list.component').then(
        (m) => m.ProjectListComponent
      ),
  },
  {
    path: 'dev/project-detail/:title',
    loadComponent: () =>
      import('./dev/project-detail/project-detail.component').then(
        (m) => m.ProjectDetailComponent
      ),
  },

  // Wildcard must be last
  {
    path: '**',
    redirectTo: '',
  },
];
