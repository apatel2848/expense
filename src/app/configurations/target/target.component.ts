import { Component, Inject, Input, OnInit, Signal, computed, inject } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { ConfigurationsService } from "../../core/services/configurations.service";
import { Location } from "../../core/models/location.model";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { AddDialogComponent } from "../location/add-dialog";
import { EditDialogComponent } from "../location/edit-dialog";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TargetModel } from "../../core/models/target.model";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import moment, { Moment } from "moment";
import { MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "../../core/constants/date-format";
import { MatInputModule } from "@angular/material/input"; 
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: "app-edit-target-dialog",
  templateUrl: "./edit-dialog.component.html",
  styles: [`.dark\:text-white-cust:is(.dark *)  {
      color: white !important;
  }`],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule, MatInputModule],
  providers: [provideNativeDateAdapter(), DatePipe, provideMomentDateAdapter(MY_FORMATS)]
})
export class EditTargetDialogComponent implements OnInit {
  service = inject(ConfigurationsService); 
  @Input('data') data: any = {   dcp: 0, donut:0, foodPlusLabour:0, pepsi:0, workmanComp: 0,   locationName:'' }; 
 
  constructor(private _snackBar: MatSnackBar) { }
    
  ngOnInit(): void { }
  
  editLocation() { 
  //   if(this.data.id === '') 
  //      this.service.addTarget(this.data).then((id) => {
  //       this.data.id = id;
  //       this._snackBar.open('Success', 'Close', {
  //         duration: 2000
  //       });;
  //     }).catch(() => {
  //       this._snackBar.open('Error', 'Close', {
  //         duration: 2000
  //       });;
  //     });
  //   else
  //     this.service.editTarget(this.data).then(() => {
  //       this._snackBar.open('Success', 'Close', {
  //         duration: 2000
  //       });;
  //     }).catch(() => {
  //       this._snackBar.open('Error', 'Close', {
  //         duration: 2000
  //       });;
  //     });
 }

}

@Component({
  selector: "app-target",
  templateUrl: "./target.component.html",
  styleUrls: ["./target.component.scss"],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, EditTargetDialogComponent]
})
export class TargetComponent implements OnInit {
  service = inject(ConfigurationsService);
 
  selectedRowObj: Signal<TargetModel> = computed(() => this.service.target());

  constructor() { }

  ngOnInit(): void { } 
}

