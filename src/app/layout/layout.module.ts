import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ConfigurationsComponent } from '../configurations/configurations.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'report', pathMatch: 'full' },
      {
        path: 'report', 
        loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule)
      }, 
      {
        path: 'config',
        component: ConfigurationsComponent,
        loadChildren: () => import('../configurations/configurations.module').then((m) => m.ConfigurationsModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), LayoutComponent, AngularSvgIconModule.forRoot(), HttpClientModule, CommonModule]
})
export class LayoutRoutingModule { }

