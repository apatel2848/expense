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
import { MatDatepicker, MatDatepickerInputEvent, MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "../../core/constants/date-format";
import { ConfigurationsService } from "../../core/services/configurations.service";
import { Location } from "../../core/models/location.model";
import moment, { Moment } from "moment";
import { MatIconModule } from "@angular/material/icon";
import { forkJoin } from "rxjs";
import {Payroll} from "../../core/models/payroll.model";

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
  public locationData: Signal<Location[]> = computed(() => this.service.allLocations());
  dateControl = new FormControl(moment());
  selectedDate: string = '';
  locationId: string = '';
  loadingTab: number = 0;

  constructor(private _datePipe: DatePipe) {
    this.service.getLocations()
  }

  
  ngOnInit(): void {
    this.dateControl.valueChanges.subscribe((value) => { 
      if(value != null && value != undefined ) {   
        this.selectedDate = value.format("YYYY-MM-DD")
      }
    })
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.loadData()
  }

  onLocationChange(locationId: String) {
    console.log(locationId)
    this.loadData()
  }

  onButtonClick(event: MatDatepickerInputEvent<Date>) {
    this.loadData()
  }

  loadData() {
    this.loadingTab = 2;

    if(this.dateControl.value != null)
      this.selectedDate = this.dateControl.value.format("YYYY-MM-DD")

    const observerable = forkJoin({
      purchaseData: this.service.getPurchase(this.selectedDate, this.locationId),
      salesData: this.service.getSales(this.selectedDate, this.locationId),
      payrollData: this.service.getPayroll(this.selectedDate, this.locationId)
    })

    observerable.subscribe((data) => { 
      console.log(data)
      this.loadingTab = 1;
    })
  }
}
