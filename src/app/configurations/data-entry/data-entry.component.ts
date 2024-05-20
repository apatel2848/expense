import { Component, OnInit, Signal, computed, inject } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { LocationComponent } from "../location";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { PurchaseComponent } from "../purchase";
import { SalesComponent } from "../sales";
import { TargetComponent } from "../target";
import { PayrollComponent } from "../payroll";
import {MatTabsModule} from '@angular/material/tabs';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "../../core/constants/date-format";
import { ConfigurationsService } from "../../core/services/configurations.service";
import { LocationModel } from "../../core/models/location.model";
import moment, { Moment } from "moment";
import { MatIconModule } from "@angular/material/icon";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-data-entry",
  templateUrl: "./data-entry.component.html",
  styleUrls: ["./data-entry.component.scss"],
  standalone: true,
  imports: [
    CommonModule, 
    MatTabsModule, 
    MatCardModule, 
    LocationComponent, 
    MatDividerModule, 
    MatButtonModule, 
    PurchaseComponent, 
    SalesComponent, 
    TargetComponent, 
    PayrollComponent,
    FormsModule, 
    MatFormFieldModule, 
    MatSelectModule,
    MatDatepickerModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [provideNativeDateAdapter(), DatePipe, provideMomentDateAdapter(MY_FORMATS)]
})
export class DataEntryComponent implements OnInit { 
  service = inject(ConfigurationsService);
  public locationData: Signal<LocationModel[]> = computed(() => this.service.allLocations());
  date = new FormControl(moment());
  dateMonth: any;
  locationId: string = '';
  loadingTab: number = 0;


  constructor(private _datePipe: DatePipe) {
    this.service.getAllLocations()
  }

  
  ngOnInit(): void {
    this.date.valueChanges.subscribe((value) => { 
      if(value != null && value != undefined ) {   
        const startOfMonth = new Date(value.year(), value.month(), value.date());
        this.dateMonth = startOfMonth;//this._datePipe.transform(startOfMonth, 'yyyy-MM-dd')??'';
      }
    })
    this.setData(this.date.value) 
  }

  loadData() {
    this.loadingTab = 2;
    const observerable = forkJoin({
      purchaseData: this.service.getPurchases(this.dateMonth, this.locationId),
      salesData: this.service.getSales(this.dateMonth, this.locationId),
      // targetData: this.service.getTarget(this.dateMonth, this.locationId),
      payrollData: this.service.getPayroll(this.dateMonth, this.locationId)
    })

    observerable.subscribe((data) => { 
      this.loadingTab = 1;
    })
  }

  setData(value: any) {
    if(value != null && value != undefined ) {   
      const startOfMonth = new Date(value.year(), value.month(), value.date());
      this.dateMonth = startOfMonth;// this._datePipe.transform(startOfMonth, 'yyyy-MM-dd')??'';
    }
  }

  // setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.date.value ?? moment();
  //   ctrlValue.month(normalizedMonthAndYear.month());
  //   ctrlValue.year(normalizedMonthAndYear.year());
  //   this.date.setValue(ctrlValue);
  //   datepicker.close();
  // }
}
