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
import { Purchase } from "../../core/models/purchase.model";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import moment, { Moment } from "moment";
import { MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "../../core/constants/date-format";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: "app-edit-purchase-dialog",
  templateUrl: "./edit-dialog.component.html",
  styles: [`.dark\:text-white-cust:is(.dark *)  {
      color: white !important;
  }`],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule, MatInputModule],
  providers: [provideNativeDateAdapter(), DatePipe, provideMomentDateAdapter(MY_FORMATS)]
})
export class EditPurchaseDialogComponent implements OnInit {
  service = inject(ConfigurationsService); 
  @Input('data') data: Purchase = new Purchase(); 


  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void { 
  }
 
  editLocation() { 
    if(this.data.id === undefined) 
       this.service.addPurchase(this.data).then((id: any) => { 
        this.data.id = id;
        this._snackBar.open('Success', 'Close', {
          duration: 2000
        });;
      }).catch(() => {
        this._snackBar.open('Error', 'Close', {
          duration: 2000
        });;
      });
    else
      this.service.editPurchase(this.data).then(() => {
        this._snackBar.open('Success', 'Close', {
          duration: 2000
        });;
      }).catch(() => {
        this._snackBar.open('Error', 'Close', {
          duration: 2000
        });;
      });
  }
}

@Component({
  selector: "app-purchase",
  templateUrl: "./purchase.component.html",
  styleUrls: ["./purchase.component.scss"],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, EditPurchaseDialogComponent]
})
export class PurchaseComponent implements OnInit {
  service = inject(ConfigurationsService);

  // @Input('dateMonth') dateMonth: string = '';
  // @Input('locationId') locationId: string = '';
 
  selectedRowObj: Signal<Purchase> = computed(() => this.service.purchase());

  constructor() { }

  ngOnInit(): void { }
}