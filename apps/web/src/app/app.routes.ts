import { Routes } from '@angular/router';
import { AppLayoutComponent } from './core/layout/app-layout.component';
import { HealthPageComponent } from './features/health/pages/health-page.component';
import { ClientsPageComponent } from './features/clients/pages/clients-page.component';
import { HomePageComponent } from './features/home/pages/home-page.component';
import { SettingsPageComponent } from './features/settings/pages/settings-page.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: HomePageComponent },
      { path: 'health', component: HealthPageComponent },
      { path: 'clients', component: ClientsPageComponent },
      { path: 'settings', component: SettingsPageComponent },
    ],
  },
];
