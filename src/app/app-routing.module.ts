import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutRoutingModule) },
  { path: '', loadChildren: () => import('./main/main.module').then(m => m.MainModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}

