import { Component, Inject, Input, OnInit, Signal, computed, inject } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { ConfigurationsService } from "../../core/services/configurations.service";
import { LocationModel } from "../../core/models/location.model";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { AddDialogComponent } from "../location/add-dialog";
import { EditDialogComponent } from "../location/edit-dialog";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PayrollModel } from "../../core/models/payroll.model";
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
  @Input('data') data: PayrollModel = { id:'', dateMonth: '', locationId:'', locationName:'', expenses: 0, maintenance: 0, managerHours: 0, otherExpenses: 0, percentOfTaxes: 0, targetAmount: 0, taxes: 0, totalExpenses: 0, totalLaborHours: 0, trainingHours: 0, workmanComp: 0};


  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void { } 

  editLocation() { 
    if(this.data.id === '') 
       this.service.addPayroll(this.data).then((id: any) => { 
        this.data.id = id;
        this._snackBar.open('Success', 'Close', {
          duration: 2000
        });
      }).catch(() => {
        this._snackBar.open('Error', 'Close', {
          duration: 2000
        });;
      });
    else
      this.service.editPayroll(this.data).then(() => {
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
    selector: "app-payroll",
    templateUrl: "./payroll.component.html",
    styleUrls: ["./payroll.component.scss"],
    standalone: true,
    imports: [CommonModule, MatCardModule, MatTableModule, EditPayrollDialogComponent, MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule, MatInputModule],
})
export class PayrollComponent implements OnInit {
  service = inject(ConfigurationsService); 
  selectedRowObj: Signal<PayrollModel> = computed(() => this.service.payroll());
  
  constructor() { }

  ngOnInit(): void { }
 
}
