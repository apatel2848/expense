import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';  
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes), LayoutComponent, AngularSvgIconModule.forRoot(), HttpClientModule, CommonModule]
})
export class LayoutRoutingModule {}

