import { Component, Inject, OnInit, inject, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from "@angular/forms";
import { ConfigurationsService } from "../../../core/services/configurations.service";
import { Location } from "../../../core/models/location.model";

@Component({
  selector: "app-edit-dialog",
  templateUrl: "./edit-dialog.component.html",
  styleUrls: ["./edit-dialog.component.scss"],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule]
})
export class EditDialogComponent implements OnInit {
  service = inject(ConfigurationsService); 

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public location: Location,
  ) {}
  

  ngOnInit(): void {
    
  }

  editLocation() {
    this.service.editLocation(this.location)
  }
}
