import { Component, OnInit, Signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, JsonPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from '../../../core/services/dashboard.service'; 
import { ColumnHeaderModel, DashboardModel } from '../../../core/models/dashboard.model';


@Component({
  selector: 'app-report',
  templateUrl: 'report.component.html',
  styleUrls: ['report.component.scss'],
  standalone: true,
  imports: [
    JsonPipe, MatTableModule, MatCardModule, FormsModule, ReactiveFormsModule, CurrencyPipe, MatChipsModule, MatDatepickerModule, MatFormFieldModule, CommonModule
  ],
  providers: [
    DashboardService, provideNativeDateAdapter()
  ]
})
export class ReportComponent implements OnInit { 
  public users: any[] = []
  public reportData: Signal<DashboardModel> = computed(() => this.dashboardService.reportReturnData());
  public displayedColumns: Signal<string[]> = computed(() => this.reportData().columnHeaders.map((column) => column.id));
  public displayedColumnObject: Signal<ColumnHeaderModel[]> = computed(() => this.reportData().columnHeaders);

  constructor(private dashboardService: DashboardService) {

  }

  getColumnDisplayName(column: string) {
    return this.displayedColumnObject().find(x => x.id == column)?.displayName
  }

  ngOnInit(): void {
    this.dashboardService.getReportData()
   }
}
