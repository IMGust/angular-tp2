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

// Novos Componentes e Guarda de Rota
import { ProductCatalog } from './components/product-catalog/product-catalog';
import { Login } from './components/login/login';
import { UserProfile } from './components/user-profile/user-profile';
import { authGuard } from './guards/auth.guard';
import { userGuard } from './guards/user.guard';

export const routes: Routes = [
  // Rota Principal Pública (Catálogo)
  { path: '', component: ProductCatalog },
  
  // Rota de Login do Administrador
  { path: 'login', component: Login },

  // Rota do Perfil do Usuário Comum
  { path: 'perfil', component: UserProfile, canActivate: [userGuard] },

  // Rotas Administrativas Protegidas (Exigem autenticação de Admin)
  { path: 'motores', component: MotorList, canActivate: [authGuard] },
  { path: 'motores/novo', component: MotorForm, canActivate: [authGuard] },
  { path: 'motores/editar/:id', component: MotorForm, resolve: { motor: motorResolver }, canActivate: [authGuard] },
  { path: 'pistoes', component: PistaoList, canActivate: [authGuard] },
  { path: 'pistoes/novo', component: PistaoForm, canActivate: [authGuard] },
  { path: 'pistoes/editar/:id', component: PistaoForm, resolve: { pistao: pistaoResolver }, canActivate: [authGuard] },
  { path: 'radiadores', component: RadiadorList, canActivate: [authGuard] },
  { path: 'radiadores/novo', component: RadiadorForm, canActivate: [authGuard] },
  { path: 'radiadores/editar/:id', component: RadiadorForm, resolve: { radiador: radiadorResolver }, canActivate: [authGuard] },
  { path: 'turbos', component: TurboList, canActivate: [authGuard] },
  { path: 'turbos/novo', component: TurboForm, canActivate: [authGuard] },
  { path: 'turbos/editar/:id', component: TurboForm, resolve: { turbo: turboResolver }, canActivate: [authGuard] },
  { path: 'veiculos', component: VeiculoList, canActivate: [authGuard] },
  { path: 'veiculos/novo', component: VeiculoForm, canActivate: [authGuard] },
  { path: 'veiculos/editar/:id', component: VeiculoForm, resolve: { veiculo: veiculoResolver }, canActivate: [authGuard] },
  { path: 'superchargers', component: SuperChargerList, canActivate: [authGuard] },
  { path: 'superchargers/novo', component: SuperChargerForm, canActivate: [authGuard] },
  { path: 'superchargers/editar/:id', component: SuperChargerForm, resolve: { superCharger: superChargerResolver }, canActivate: [authGuard] },
];

