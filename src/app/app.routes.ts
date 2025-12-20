import { Routes } from '@angular/router';
import { Clients } from './clients/clients';
import { Comptes } from './comptes/comptes';
import {NoveauClient} from'./noveau-client/noveau-client';

export const routes: Routes = [
  { path: 'clients', component: Clients },
  { path: 'comptes', component: Comptes },
  { path: 'noveau-client', component: NoveauClient },
  { path: '', redirectTo: 'clients', pathMatch: 'full' }
];
