import { Component, OnInit, Signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, JsonPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from '../../../core/services/dashboard.service'; 
import { ColumnHeaderModel, DashboardModel } from '../../../core/models/dashboard.model';
import { MY_FORMATS } from '../../../core/constants/date-format';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import {MatInputModule} from '@angular/material/input'; 
import {MatIconModule} from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReportModel } from '../../../core/models/report.model';
import { ReportTableLoaderComponent } from '../report-table-loader';

const moment = _rollupMoment || _moment;

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
    CommonModule,
    ReportTableLoaderComponent
  ],
  providers: [
    DashboardService, provideNativeDateAdapter(), DatePipe, provideMomentDateAdapter(MY_FORMATS),
  ]
})
export class ReportComponent implements OnInit { 
  public users: any[] = []
  public reportData: Signal<DashboardModel> = computed(() => this.dashboardService.reportReturnData());
  public displayedColumns: Signal<string[]> = computed(() => this.reportData().columnHeaders.map((column) => column.id));
  public displayedColumnObject: Signal<ColumnHeaderModel[]> = computed(() => this.reportData().columnHeaders);
  date = new FormControl(moment());
  loader: boolean = false;

  constructor(private dashboardService: DashboardService, private _datePipe: DatePipe) {

  }


  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  getColumnDisplayName(column: string) {
    return this.displayedColumnObject().find(x => x.id == column)?.displayName
  }

  getReport(dateValue: any) { 

    if(dateValue != null && dateValue != undefined ) { 
      this.loader = true;
      const startOfMonth = new Date(dateValue.year(), dateValue.month(), 1);
      this.dashboardService.getReportData(this._datePipe.transform(startOfMonth, 'yyyy-MM-dd')).subscribe((data :ReportModel) => {  
        this.loader = false;
      })
    }
  }

  ngOnInit(): void {
      this.date.valueChanges.subscribe((value) => { 
        this.getReport(value)
      })

      this.getReport(this.date.value)
   } 
}
