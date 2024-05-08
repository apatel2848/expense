import { Component, computed, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { RouterOutlet } from "@angular/router";
import { ConfigurationsService } from "../core/services/configurations.service"; 
import { LocationComponent } from "./location";
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: "app-configurations",
  templateUrl: "./configurations.component.html",
  styleUrls: ["./configurations.component.scss"],
  standalone: true,
  imports: [RouterOutlet, MatCardModule, LocationComponent, MatDividerModule]
})
export class ConfigurationsComponent {
  service = inject(ConfigurationsService);

  public cardLable = computed(() => this.service.componentLable());

  constructor() { }
}
