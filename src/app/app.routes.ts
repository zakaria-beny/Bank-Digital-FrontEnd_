import { Routes } from '@angular/router';
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

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'clients', component: Clients },
  { path: 'comptes', component: Comptes },
  { path: 'noveau-client', component: NoveauClient },
  { path: 'edit-client/:id', component: EditClient },
  { path: 'client-details/:id', component: ClientDetails },
  { path: 'client-comptes/:id', component: ClientComptes },
  { path: 'nouveau-compte', component: NouveauCompte },
  { path: 'edit-compte/:id', component: EditCompte },
  { path: 'compte-details/:id', component: CompteDetails },
  { path: 'operations/:id', component: Operations },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
