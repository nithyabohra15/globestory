import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage'
import { SignupComponent } from './auth/signup/signup';
import { LoginComponent } from './auth/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomepageComponent } // ✅ critical
];

