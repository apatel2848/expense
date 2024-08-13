import { Component, Inject, OnInit, Signal, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfigurationsService } from "../../core/services/configurations.service";
import { Location } from "../../core/models/location.model";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogTitle,
  MatDialogContent  } from '@angular/material/dialog';
import { AddDialogComponent } from "./add-dialog";
import { EditDialogComponent } from "./edit-dialog";
import { PurchaseComponent } from "../purchase";
import { SalesComponent } from "../sales";
import { TargetComponent } from "../target";
import { PayrollComponent } from "../payroll";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";

@Component({
  selector: "app-location",
  templateUrl: "./location.component.html",
  styleUrls: ["./location.component.scss"],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, LocationComponent, MatDividerModule, MatButtonModule, MatDialogModule, PurchaseComponent, SalesComponent, TargetComponent, PayrollComponent],
})
export class LocationComponent implements OnInit {
  service = inject(ConfigurationsService);
  public locationData: Signal<Location[]> = computed(() => this.service.allLocations());
  public displayedColumnObject: any[] = [{ key: 'id', header: 'Id' }, { key: 'name', header: 'Name' }, { key: 'dcp', header: 'DCP' }, { key: 'donut', header: 'Donut' }, { key: 'pepsi', header: 'Pepsi' }, { key: 'workmanComp', header: 'Workman Comp' }, { key: 'foodPlusLabor', header: 'Food Plus Labor' }]
  public displayedColumns: string[] = this.displayedColumnObject.map((column) => column.key)
  selectedRowId: string= '';
  selectedRowObj: Location = new Location()

  constructor(public dialog: MatDialog) {
    this.service.updateLable("Location");
    this.service.getLocations()
  }

  ngOnInit(): void {
  }

  getColumnDisplayName(column: string) {
    return this.displayedColumnObject.find(x => x.key == column)?.header
  }

  selectRow(row: any) { 
    console.log(row)
    console.log(this.selectedRowId)
    // if(row.id == this.selectedRowId) { 
    //   this.selectedRowId = ''
    //   this.selectedRowObj = new Location()
    //   return
    // }

    this.selectedRowId = row.id
    this.selectedRowObj = row
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.service.getLocations()
    });
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(EditDialogComponent, { data: Object.assign({}, this.selectedRowObj)});

    dialogRef.afterClosed().subscribe(result => {
      this.service.getLocations()
    });
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DialogConfirmComponant, { data: Object.assign({}, this.selectedRowObj)});

    dialogRef.afterClosed().subscribe(result => {
      this.service.getLocations()
    });
  }

}

@Component({
  selector: 'dialog-confirm', 
  templateUrl: './dialog-confirm.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
})
export class DialogConfirmComponant {
  service = inject(ConfigurationsService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Location) {} 

  deleteLocation(){
    this.service.deleteLocation(this.data)
  }
}