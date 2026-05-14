import { Routes } from '@angular/router';
import { MotorList } from './components/motor-list/motor-list';


import { MotorForm } from './components/motor-form/motor-form';
import { motorResolver } from './resolvers/motor-resolver';
import { PistaoList } from './components/pistao-list/pistao-list';
import { PistaoForm } from './components/pistao-form/pistao-form';
import { pistaoResolver } from './resolvers/pistao-resolver';
import { RadiadorList } from './components/radiador-list/radiador-list';
import { RadiadorForm } from './components/radiador-form/radiador-form';
import { radiadorResolver } from './resolvers/radiador-resolver';
import { TurboList } from './components/turbo-list/turbo-list';
import { TurboForm } from './components/turbo-form/turbo-form';
import { turboResolver } from './resolvers/turbo-resolver';
import { VeiculoList } from './components/veiculo-list/veiculo-list';
import { VeiculoForm } from './components/veiculo-form/veiculo-form';
import { veiculoResolver } from './resolvers/veiculo-resolver';
import { SuperChargerList } from './components/super-charger-list/super-charger-list';
import { SuperChargerForm } from './components/super-charger-form/super-charger-form';
import { superChargerResolver } from './resolvers/super-charger-resolver';

export const routes: Routes = [
  { path: '', redirectTo: 'motores', pathMatch: 'full' },
  { path: 'motores', component: MotorList },
  { path: 'motores/novo', component: MotorForm },
  { path: 'motores/editar/:id', component: MotorForm, resolve: { motor: motorResolver } },
  { path: 'pistoes', component: PistaoList },
  { path: 'pistoes/novo', component: PistaoForm },
  { path: 'pistoes/editar/:id', component: PistaoForm, resolve: { pistao: pistaoResolver } },
  { path: 'radiadores', component: RadiadorList },
  { path: 'radiadores/novo', component: RadiadorForm },
  { path: 'radiadores/editar/:id', component: RadiadorForm, resolve: { radiador: radiadorResolver } },
  { path: 'turbos', component: TurboList },
  { path: 'turbos/novo', component: TurboForm },
  { path: 'turbos/editar/:id', component: TurboForm, resolve: { turbo: turboResolver } },
  { path: 'veiculos', component: VeiculoList },
  { path: 'veiculos/novo', component: VeiculoForm },
  { path: 'veiculos/editar/:id', component: VeiculoForm, resolve: { veiculo: veiculoResolver } },
  { path: 'superchargers', component: SuperChargerList },
  { path: 'superchargers/novo', component: SuperChargerForm },
  { path: 'superchargers/editar/:id', component: SuperChargerForm, resolve: { superCharger: superChargerResolver } },
];
