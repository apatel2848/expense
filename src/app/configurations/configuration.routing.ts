import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';  
import { PurchaseComponent } from './purchase';
import { LocationComponent } from './location';
import { ConfigurationsComponent } from './configurations.component';
import { DataEntryComponent } from './data-entry';

const routes: Routes = [
  {
    path: '', 
    component: ConfigurationsComponent,
    children: [
      { path: '', redirectTo: 'location', pathMatch: 'full' },
      { path: 'location', component: LocationComponent },
      { path: 'data-entry', component: DataEntryComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule { }
