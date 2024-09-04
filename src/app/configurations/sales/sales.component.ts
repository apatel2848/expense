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
import { APP_FORMATS } from "../../core/constants/format";
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
  providers: [provideNativeDateAdapter(), DatePipe, provideMomentDateAdapter(APP_FORMATS)]
})
export class EditSalesDialogComponent implements OnInit {
  service = inject(ConfigurationsService);
  @Input('data') sales: Sales = new Sales()


  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void { 
  } 

  editSales() { 
    if(this.sales.id === undefined) 
       this.service.addSales(this.sales).then((id: any) => { 
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
    {
      let s = Object.assign(new Sales(), this.sales)

      this.service.editSales(s).then(() => {
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

