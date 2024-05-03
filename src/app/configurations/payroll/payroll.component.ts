import { Component, Inject, OnInit, Signal, computed, inject } from "@angular/core";
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

@Component({
  selector: "app-payroll",
  templateUrl: "./payroll.component.html",
  styleUrls: ["./payroll.component.scss"],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule]
})
export class PayrollComponent implements OnInit {
  service = inject(ConfigurationsService);


  public payrollData: Signal<PayrollModel[]> = computed(() => this.service.allPayroll());
  public locationData: Signal<LocationModel[]> = computed(() => this.service.allLocations());
  public displayedColumnObject: any[] = [{ key: 'locationName', header: 'Location' },
   { key: 'expenses', header: 'Expenses' }, 
   { key: 'maintenance', header: 'Maintenance' }, 
   { key: 'managerHours', header: 'ManagerHours' }, 
   { key: 'otherExpenses', header: 'Other Expenses' }, 
   { key: 'percentOfTaxes', header: '% Of Taxes' }, 
   { key: 'targetAmount', header: 'Target Amount' }, 
   { key: 'taxes', header: 'Taxes' }, 
   { key: 'totalExpenses', header: 'Total Expenses' }, 
   { key: 'totalLaborHours', header: 'Total Labor Hours' }, 
   { key: 'trainingHours', header: 'Training Hours' }, 
   { key: 'workmanComp', header: 'Workman Comp' },  
   { key: 'dateMonth', header: 'Date Month'}]

  public displayedColumns: string[] = this.displayedColumnObject.map((column) => column.key)
  selectedRowId: any = '';
  selectedRowObj: PayrollModel = { id:'', dateMonth: '', locationId:'', locationName:'', expenses: 0, maintenance: 0, managerHours: 0, otherExpenses: 0, percentOfTaxes: 0, targetAmount: 0, taxes: 0, totalExpenses: 0, totalLaborHours: 0, trainingHours: 0, workmanComp: 0};

  constructor(public dialog: MatDialog) {
    this.service.getAllPayrolls()
  }

  ngOnInit(): void { }

  getColumnDisplayName(column: string) {
    return this.displayedColumnObject.find(x => x.key == column)?.header
  }

  selectRow(row: any) {

    if (row.id == this.selectedRowId) {
      this.selectedRowId = ''
      this.selectedRowObj = { id:'', dateMonth: '', locationId:'', locationName:'', expenses: 0, maintenance: 0, managerHours: 0, otherExpenses: 0, percentOfTaxes: 0, targetAmount: 0, taxes: 0, totalExpenses: 0, totalLaborHours: 0, trainingHours: 0, workmanComp: 0};
      return
    }

    this.selectedRowId = row.id
    this.selectedRowObj = row
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddPayrollDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.getAllPayrolls()
      }
    });
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(EditPayrollDialogComponent, { data: Object.assign({}, this.selectedRowObj) });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.getAllPayrolls()
      }
    });
  }
}


@Component({
  selector: "app-add-payroll-dialog",
  templateUrl: "./add-dialog.component.html",
  styles: [`.dark\:text-white-cust:is(.dark *)  {
      color: white !important;
  }`],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatSelectModule,
    MatDatepickerModule, ReactiveFormsModule, MatInputModule],
    providers: [provideNativeDateAdapter(), DatePipe, provideMomentDateAdapter(MY_FORMATS)]
})
export class AddPayrollDialogComponent implements OnInit {
  service = inject(ConfigurationsService);
  public locationData: LocationModel[] = this.service.allLocations();
  date = new FormControl(moment());

  payroll: PayrollModel = { id:'', dateMonth: '', locationId:'', locationName:'', expenses: 0, maintenance: 0, managerHours: 0, otherExpenses: 0, percentOfTaxes: 0, targetAmount: 0, taxes: 0, totalExpenses: 0, totalLaborHours: 0, trainingHours: 0, workmanComp: 0};

  constructor(private _datePipe: DatePipe) { }

  ngOnInit(): void {
    this.date.valueChanges.subscribe((value) => { 
      if(value != null && value != undefined ) {   
        const startOfMonth = new Date(value.year(), value.month(), 1);
        this.payroll.dateMonth = this._datePipe.transform(startOfMonth, 'yyyy-MM-dd')??'';
      }
    })
    this.setData(this.date.value) 
  }

  setData(value: any) {
    if(value != null && value != undefined ) {   
      const startOfMonth = new Date(value.year(), value.month(), 1);
      this.payroll.dateMonth = this._datePipe.transform(startOfMonth, 'yyyy-MM-dd')??'';
    }
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  addLocation() { 
    this.service.addPayroll(this.payroll)
  }
}



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
  public locationData: LocationModel[] = this.service.allLocations();
  date = new FormControl(moment(new Date(this.data.dateMonth)));

  constructor(
    private _datePipe: DatePipe,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PayrollModel,
  ) { }

  ngOnInit(): void {
    this.date.valueChanges.subscribe((value) => { 
      if(value != null && value != undefined ) {   
        const startOfMonth = new Date(value.year(), value.month(), 1);
        this.data.dateMonth = this._datePipe.transform(startOfMonth, 'yyyy-MM-dd')??'';
      }
    })
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  editLocation() { 
    this.service.editPayroll(this.data)
  }
}
