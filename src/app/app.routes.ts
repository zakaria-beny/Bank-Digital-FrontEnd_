import { Routes } from '@angular/router';

// 👇 IMPORTING 'Clients' and 'Comptes' (No Component suffix)
import { Clients } from './clients/clients';
import { Comptes } from './comptes/comptes';

import { NoveauClient } from './noveau-client/noveau-client';
import { EditClient } from './edit-client/edit-client';
import { ClientDetails } from './client-details/client-details';
import { NouveauCompte } from './nouveau-compte/nouveau-compte';
import { CompteDetails } from './compte-details/compte-details';
import { ClientComptes } from './client-comptes/client-comptes';
import { EditCompte } from './edit-compte/edit-compte';
import { Operations } from './operations/operations';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { AuthGuard } from './guard/guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },

  // 👇 USING 'Clients' and 'Comptes'
  { path: 'clients', component: Clients, canActivate: [AuthGuard] },
  { path: 'comptes', component: Comptes, canActivate: [AuthGuard] },

  { path: 'noveau-client', component: NoveauClient, canActivate: [AuthGuard] },
  { path: 'edit-client/:id', component: EditClient, canActivate: [AuthGuard] },
  { path: 'client-details/:id', component: ClientDetails, canActivate: [AuthGuard] },
  { path: 'client-comptes/:id', component: ClientComptes, canActivate: [AuthGuard] },
  { path: 'nouveau-compte', component: NouveauCompte, canActivate: [AuthGuard] },
  { path: 'edit-compte/:id', component: EditCompte, canActivate: [AuthGuard] },
  { path: 'compte-details/:id', component: CompteDetails, canActivate: [AuthGuard] },
  { path: 'operations/:id', component: Operations, canActivate: [AuthGuard] },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
