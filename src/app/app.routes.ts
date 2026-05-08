import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'upload',
    loadComponent: () =>
      import('./features/upload/upload.component').then(m => m.UploadComponent)
  },
  {
    path: 'result',
    loadComponent: () =>
      import('./features/result/result.component').then(m => m.ResultComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
