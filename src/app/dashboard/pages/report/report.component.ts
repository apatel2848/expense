import { Component, OnInit, Signal, computed, ChangeDetectionStrategy, inject, WritableSignal, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from '../../../core/services/dashboard.service'; 
import { ColumnHeaderModel, DashboardModel, PeriodicElement } from '../../../core/models/dashboard.model';
import { APP_FORMATS } from '../../../core/constants/format';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import {MatInputModule} from '@angular/material/input'; 
import {MatIconModule} from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportTableLoaderComponent } from '../report-table-loader';
import { MatSelectModule } from '@angular/material/select';
import { ConfigurationsService } from '../../../configurations';
import { Location } from "../../../core/models/location.model";
import { timeStamp } from 'console';
import { Observable, of } from 'rxjs';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-report',
  templateUrl: 'report.component.html',
  styleUrls: ['report.component.scss'],
  standalone: true,
  imports: [
    JsonPipe, 
    MatTableModule, 
    MatProgressSpinnerModule, 
    MatIconModule, 
    MatCardModule, 
    FormsModule,
    MatInputModule, 
    ReactiveFormsModule, 
    CurrencyPipe, 
    MatChipsModule, 
    MatDatepickerModule,
    MatFormFieldModule, 
    MatSelectModule,
    CommonModule,
    ReportTableLoaderComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService, provideNativeDateAdapter(), DatePipe, provideMomentDateAdapter(MY_FORMATS)]
})
 
export class ReportComponent implements OnInit { 

  configurationService = inject(ConfigurationsService);
  dashboardService = inject(DashboardService);
  public locationData: Signal<Location[]> = computed(() => this.configurationService.allLocations());
  //public displayedColumns: Signal<string[]> = computed(() => []);
  public displayedColumns: WritableSignal<string[]> = signal([])
  public valueColumns: WritableSignal<any[]> = signal([])

  //public dataSource: WritableSignal<any[]> = signal([])
  public dataSource: WritableSignal<Array<{}>> = signal([{}])
  
  readonly dateControl = new FormControl(moment());
  loader: boolean = false;
  locationId: string = '';
  selectedMonth: number = 0
  selectedYear: number = 0
  // dataSource: Array<any> = []

  constructor(private _datePipe: DatePipe) { 
    this.configurationService.getLocations()
  }

  ngOnInit(): void {
    this.selectedMonth = this.dateControl.value?.month() ?? 0
    this.selectedYear = this.dateControl.value?.year() ?? 0

    console.log(this.displayedColumns)

    // this.displayedColumns = ['week', 'donut', 'dcp', 'pepsi']

     //getting reort
     this.getReport(this.locationId, this.selectedMonth, this.selectedYear)
  }

  onMonthChange(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.selectedMonth = normalizedMonthAndYear.month()
    this.selectedYear = normalizedMonthAndYear.year()
    var selectedLocation = this.locationId;

    //set display value
    const ctrlValue = this.dateControl.value ?? moment();
    ctrlValue.month(this.selectedMonth);
    ctrlValue.year(this.selectedYear);
    this.dateControl.setValue(ctrlValue);
    datepicker.close();

    //getting reort
    this.getReport(this.locationId, this.selectedMonth, this.selectedYear)
  }

  onLocationChange(locationId: String) {
    console.log(locationId)

    this.selectedMonth = Number(this.dateControl.value?.month());
    this.selectedYear = Number(this.dateControl.value?.year());
    var selectedLocation = this.locationId;

    //getting reort
    this.getReport(this.locationId, this.selectedMonth, this.selectedYear)
  }

  // get report
  getReport(locationId: string, selectedMonth: number, selectedYear: number) { 
    console.log(selectedMonth)
    console.log(selectedYear)
    
    // this.dashboardService.getWeeklyReportData(locationId, selectedMonth, selectedYear).subscribe(data => {
    //   let xt: Array<any> = []

    //   data.forEach(x => {
    //     let row = {
    //         week: x.week,
    //         totalDonut: x.purchaseData.donut,
    //         totalPepsi:  x.purchaseData.pepsi,
    //         totalDcp: x.purchaseData.dcp
    //     }
    //     xt.push(row) 
    //   })
    //   console.log(xt)
    //   this.dataSource = xt
    // })

    // this.dataSource  = this.dashboardService.getWeeklyReportData(locationId, selectedMonth, selectedYear)
    // console.log('....???...' + this.dataSource)
    // this.displayedColumns = computed(() => Object.keys(this.dataSource[0]))

    if(locationId != null && locationId.length > 0)
    {
      // let rows = [
      //   {header: 'week', week1: 0, week2: 0, week3: 0, week4: 0},
      //   {header: 'donut', week1: 0, week2: 0, week3: 0, week4: 0},
      //   {header: 'pepsi', week1: 0, week2: 0, week3: 0, week4: 0},
      //   {header: 'dcp', week1: 0, week2: 0, week3: 0, week4: 0}
      // ]
      // //this.dataSource.update(values => [...values, rows]);
      // this.dataSource.set(rows)
      //this.displayedColumns.set(['header', 'week31', 'week32', 'week33', 'week34', 'week35'])

      this.dashboardService.getWeeklyReportData(locationId, selectedMonth, selectedYear).subscribe(x => {
        
        //first row has header values
        this.valueColumns.set(x[0])

        //remove first row and set values
        x.shift()
        this.dataSource.set(x)

        //set header keys for values
        this.displayedColumns.set(Object.keys(x[0]))
      })
    }
  }

  public getColumnDisplayName(key: any)
    {
      return this.valueColumns()[key]
    }
}