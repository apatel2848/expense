import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';  
import { PurchaseComponent } from './purchase';
import { LocationComponent } from './location';

const routes: Routes = [
  {
    path: '', 
    children: [
      { path: '', redirectTo: 'location', pathMatch: 'full' },
      { path: 'location', component: LocationComponent },
      { path: 'purchase', component: PurchaseComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule { }
