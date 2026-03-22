import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),
    canActivate: [authGuard, adminGuard] 
  },
  { 
    path: 'admin/users', 
    loadComponent: () => import('./features/admin/user-list/user-list.component').then(c => c.UserListComponent),
    canActivate: [authGuard, adminGuard] 
  },
  { 
    path: 'skills', 
    loadComponent: () => import('./features/skills/skill-list/skill-list.component').then(c => c.SkillListComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'skills/new', 
    loadComponent: () => import('./features/skills/skill-form/skill-form.component').then(c => c.SkillFormComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'skills/:id/edit', 
    loadComponent: () => import('./features/skills/skill-form/skill-form.component').then(c => c.SkillFormComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'skills/:id', 
    loadComponent: () => import('./features/skills/skill-detail/skill-detail.component').then(c => c.SkillDetailComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'goals', 
    loadComponent: () => import('./features/goals/goal-list/goal-list.component').then(c => c.GoalListComponent),
    canActivate: [authGuard] 
  },
  { 
    path: 'achievements', 
    loadComponent: () => import('./features/achievements/achievement-list/achievement-list.component').then(c => c.AchievementListComponent),
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '/dashboard' }
];
