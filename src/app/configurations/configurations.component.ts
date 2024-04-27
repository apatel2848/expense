import { Component, computed, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { RouterOutlet } from "@angular/router";
import { ConfigurationsService } from "../core/services/configurations.service"; 

@Component({
  selector: "app-configurations",
  templateUrl: "./configurations.component.html",
  styleUrls: ["./configurations.component.scss"],
  standalone: true,
  imports: [RouterOutlet, MatCardModule],
  providers: [ConfigurationsService]
})
export class ConfigurationsComponent {
  service = inject(ConfigurationsService);

  public cardLable = computed(() => this.service.componentLable());

  constructor() { }
}
