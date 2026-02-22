import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'students' },
  {
    path: 'students',
    loadComponent: () => import('./students/students.page').then((m) => m.StudentsPage),
  },
];
