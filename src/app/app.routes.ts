import { Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

export const routes: Routes = [
    {
      path: 'dashboard',
      loadComponent: () =>
        import('./components/task-dashboard/task-dashboard.component').then(
          (m) => m.TaskDashboardComponent
        ),
      providers: [provideHttpClient()],
      title: 'Task Dashboard',
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },
    {
      path: '**',
      redirectTo: 'dashboard'
    }
  ];
