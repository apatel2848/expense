import { Component, Input, OnInit,  Signal,  computed,  inject } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { ConfigurationsService } from "../../core/services/configurations.service";
import { MatDialogModule } from "@angular/material/dialog"; 
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Sales } from "../../core/models/sales.model";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideNativeDateAdapter } from "@angular/material/core";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "../../core/constants/date-format";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
  

@Component({
  selector: "app-edit-sales-dialog",
  templateUrl: "./edit-dialog.component.html",
  styles: [`.dark\:text-white-cust:is(.dark *)  {
      color: white !important;
  }`],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule, MatInputModule],
  providers: [provideNativeDateAdapter(), DatePipe, provideMomentDateAdapter(MY_FORMATS)]
})
export class EditSalesDialogComponent implements OnInit {
  service = inject(ConfigurationsService);
  @Input('data') data: Sales = new Sales()


  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void { 
  } 

  editLocation() { 
    if(this.data.id === undefined) 
       this.service.addSales(this.data).then((id: any) => { 
        // this.data.id = id;
        this._snackBar.open('Success', 'Close', {
          duration: 2000
        });;
      }).catch(() => {
        this._snackBar.open('Error', 'Close', {
          duration: 2000
        });;
      });
    else
      this.service.editSales(this.data).then(() => {
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
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.scss"],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, EditSalesDialogComponent]
})
export class SalesComponent implements OnInit {
  service = inject(ConfigurationsService);
 
  selectedRowObj: Signal<Sales> = computed(() => this.service.sales());

  constructor() { }

  ngOnInit(): void { } 
}

