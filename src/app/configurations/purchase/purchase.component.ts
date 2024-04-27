import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {  MatCardModule } from "@angular/material/card"; 
import { ConfigurationsService } from "../../core/services/configurations.service";

@Component({
  selector: "app-purchase",
  templateUrl: "./purchase.component.html",
  styleUrls: ["./purchase.component.scss"],
  standalone: true,
  imports: [CommonModule, MatCardModule]
})
export class PurchaseComponent implements OnInit { 
  service = inject(ConfigurationsService);

  constructor() {
    this.service.updateLable("Purchase"); 
  }

  ngOnInit(): void { }
}
