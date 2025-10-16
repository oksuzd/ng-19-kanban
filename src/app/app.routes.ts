import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'projects' },

  {
    path: 'projects',
    loadComponent: () =>
      import('./feature/projects/pages/projects-list/projects-list.component')
        .then(m => m.ProjectsListComponent),
    title: 'Projects',
  },

  {
    path: 'project/:id',
    loadComponent: () =>
      import('./feature/projects/pages/project-details/project-details.component')
        .then(m => m.ProjectDetailsComponent),
    title: 'Project',
  },

  {
    path: 'project/:id/board/:boardId',
    loadComponent: () =>
      import('./feature/boards/pages/board/board.component')
        .then(m => m.BoardComponent),
    title: 'Board',
  },

  {
    path: 'analytics',
    loadComponent: () =>
      import('./feature/analytics/pages/analytics/analytics.component')
        .then(m => m.AnalyticsComponent),
    title: 'Analytics',
  },

  {
    path: 'settings',
    loadComponent: () =>
      import('./feature/settings/pages/settings/settings.component')
        .then(m => m.SettingsComponent),
    title: 'Settings',
  },

  { path: '**', redirectTo: 'projects' },
];

