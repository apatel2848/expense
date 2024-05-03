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
import { TargetModel } from "../../core/models/target.model";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import moment, { Moment } from "moment";
import { MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "../../core/constants/date-format";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-target",
  templateUrl: "./target.component.html",
  styleUrls: ["./target.component.scss"],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule]
})
export class TargetComponent implements OnInit {
  service = inject(ConfigurationsService);


  public targetData: Signal<TargetModel[]> = computed(() => this.service.allTarget());
  public locationData: Signal<LocationModel[]> = computed(() => this.service.allLocations());
  public displayedColumnObject: any[] = [{ key: 'locationName', header: 'Location' }, { key:"dcp", header: "DCP" },{ key:"donut", header: "Donut" },{ key:"foodPlusLabour", header: "Food Plus Labour" },{ key:"pepsi", header: "Pepsi" },{ key:"workmanComp", header: "Workman Comp" },  { key: 'dateMonth', header: 'Date Month'}]
  public displayedColumns: string[] = this.displayedColumnObject.map((column) => column.key)
  selectedRowId: any = '';
  selectedRowObj: TargetModel = { id:'', dateMonth: '',  dcp: 0, donut:0, foodPlusLabour:0, pepsi:0, workmanComp: 0, locationId:'', locationName:''};

  constructor(public dialog: MatDialog) {
    this.service.getAllTarget()
  }

  ngOnInit(): void { }

  getColumnDisplayName(column: string) {
    return this.displayedColumnObject.find(x => x.key == column)?.header
  }

  selectRow(row: any) {

    if (row.id == this.selectedRowId) {
      this.selectedRowId = ''
      this.selectedRowObj = { id:'', dateMonth: '',dcp: 0, donut:0, foodPlusLabour:0, pepsi:0, workmanComp: 0, locationId:'', locationName:''};
      return
    }

    this.selectedRowId = row.id
    this.selectedRowObj = row
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddTargetDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.getAllTarget()
      }
    });
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(EditTargetDialogComponent, { data: Object.assign({}, this.selectedRowObj) });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.getAllTarget()
      }
    });
  }
}


@Component({
  selector: "app-add-target-dialog",
  templateUrl: "./add-dialog.component.html",
  styles: [`.dark\:text-white-cust:is(.dark *)  {
      color: white !important;
  }`],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatSelectModule,
    MatDatepickerModule, ReactiveFormsModule, MatInputModule],
    providers: [provideNativeDateAdapter(), DatePipe, provideMomentDateAdapter(MY_FORMATS)]
})
export class AddTargetDialogComponent implements OnInit {
  service = inject(ConfigurationsService);
  public locationData: LocationModel[] = this.service.allLocations();
  date = new FormControl(moment());

  target: TargetModel = { id:'', dateMonth: '', dcp: 0, donut:0, foodPlusLabour:0, pepsi:0, workmanComp: 0, locationId:'', locationName:'' };

  constructor(private _datePipe: DatePipe) { }

  ngOnInit(): void {
    this.date.valueChanges.subscribe((value) => { 
      if(value != null && value != undefined ) {   
        const startOfMonth = new Date(value.year(), value.month(), 1);
        this.target.dateMonth = this._datePipe.transform(startOfMonth, 'yyyy-MM-dd')??'';
      }
    })
    this.setData(this.date.value) 
  }

  setData(value: any) {
    if(value != null && value != undefined ) {   
      const startOfMonth = new Date(value.year(), value.month(), 1);
      this.target.dateMonth = this._datePipe.transform(startOfMonth, 'yyyy-MM-dd')??'';
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
    this.service.addTarget(this.target)
  }
}



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
  public locationData: LocationModel[] = this.service.allLocations();
  date = new FormControl(moment(new Date(this.data.dateMonth)));

  constructor(
    private _datePipe: DatePipe,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TargetModel,
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
    this.service.editTarget(this.data)
  }
}
