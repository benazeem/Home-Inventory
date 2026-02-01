import { Routes } from '@angular/router';
import { Signup } from './pages/signup/signup';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { Dashboard } from './pages/dashboard/dashboard';
import { Inventory } from './pages/inventory/inventory';
import { Profile } from './pages/profile/profile';
import { LandingPageComponent } from './pages/landing-page/landing-page';
import { NotFound } from './pages/not-found/not-found';
import { noAuthGuard } from './guards/no-auth-guard';
import { AddItem } from './pages/add-item/add-item';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, canActivate: [noAuthGuard] },
  {
    path: '',
    canActivate: [noAuthGuard],
    children: [
      { path: 'signup', component: Signup },
      { path: 'login', component: Login },
    ],
  },
  // 🔒 Authenticated area
  {
    path: 'app',
    // canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'inventory', component: Inventory },
      { path: 'profile', component: Profile },
      { path: 'add-item', component: AddItem },
      // add more protected routes here
    ],
  },

  // Fallback (optional)
  { path: '**', component: NotFound },
];
