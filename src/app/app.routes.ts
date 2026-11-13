import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Cultivos } from './pages/cultivos/cultivos';
import { Dashboard } from './pages/dashboard/dashboard';
import { Actividades } from './pages/actividades/actividades';
import { Inventario } from './pages/inventario/inventario';
import { Cosechas } from './pages/cosechas/cosechas';

export const routes: Routes = [
  {
    path: '',
    component: Inicio,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'cultivos',
    component: Cultivos,
  },
  {
    path: 'actividades',
    component: Actividades,
  },
  {
    path: 'inventario',
    component: Inventario,
  },
  {
    path: 'cosechas',
    component: Cosechas,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
