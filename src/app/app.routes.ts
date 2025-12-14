import { Routes } from '@angular/router';
import { Clients } from './clients/clients';
import { Comptes } from './comptes/comptes';

export const routes: Routes = [
  { path: 'clients', component: Clients },
  { path: 'comptes', component: Comptes },
  { path: '', redirectTo: 'clients', pathMatch: 'full' }
];
