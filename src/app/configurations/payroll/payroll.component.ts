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
import { Payroll } from "../../core/models/payroll.model";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import moment, { Moment } from "moment";
import { MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "../../core/constants/date-format";
import { MatInputModule } from "@angular/material/input";
import { forwardRef } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Timestamp } from "firebase/firestore";
 


@Component({
  selector: "app-edit-payroll-dialog",
  templateUrl: "./edit-dialog.component.html",
  styles: [`.dark\:text-white-cust:is(.dark *)  {
      color: white !important;
  }`],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule, MatInputModule],
  providers: [provideNativeDateAdapter(), DatePipe, provideMomentDateAdapter(MY_FORMATS)]
})


export class EditPayrollDialogComponent implements OnInit {
  service = inject(ConfigurationsService);  
  @Input('data') payroll:Payroll = new Payroll();

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void { }  

  upsertPayroll() { 
    if(this.payroll.id === undefined) {
       this.service.addPayroll(this.payroll).then((id: any) => { 
        // this.payroll.id = id;
        this._snackBar.open('Success', 'Close', {
          duration: 2000
        });
      }).catch(() => {
        this._snackBar.open('Error', 'Close', {
          duration: 2000
        });;
      });
    }
    else
    {
      console.log(this.payroll)
      let p = Object.assign(new Payroll(), this.payroll)
      console.log(p)
      
      this.service.editPayroll(p).then(() => {
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
}


@Component({
    selector: "app-payroll",
    templateUrl: "./payroll.component.html",
    styleUrls: ["./payroll.component.scss"],
    standalone: true,
    imports: [CommonModule, MatCardModule, MatTableModule, EditPayrollDialogComponent, MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule, MatInputModule],
})
export class PayrollComponent implements OnInit {
  service = inject(ConfigurationsService); 
  selectedRowObj: Signal<Payroll> = computed(() => this.service.payroll());
  
  constructor() { }

  ngOnInit(): void { }
 
}
