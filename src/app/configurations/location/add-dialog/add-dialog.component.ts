import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from "@angular/forms";
import { ConfigurationsService } from "../../../core/services/configurations.service";
import { Location } from "../../../core/models/location.model";

@Component({
  selector: "app-add-dialog",
  templateUrl: "./add-dialog.component.html",
  styleUrls: ["./add-dialog.component.scss"],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule]
})
export class AddDialogComponent implements OnInit {
  service = inject(ConfigurationsService);

  location: Location = new Location()

  constructor() { }

  ngOnInit(): void {

  }

  addLocation() {
    this.service.addLocation(this.location)
  }
}
