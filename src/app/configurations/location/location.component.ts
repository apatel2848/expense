import { Component, OnInit, Signal, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfigurationsService } from "../../core/services/configurations.service";
import { LocationModel } from "../../core/models/location.model";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
  public locationData: Signal<LocationModel[]> = computed(() => this.service.allLocations());
  public displayedColumnObject: any[] = [{ key: 'id', header: 'Id' }, { key: 'name', header: 'Name' }, { key: 'dcp', header: 'DCP' }, { key: 'donut', header: 'Donut' }, { key: 'pepsi', header: 'Pepsi' }, { key: 'workmanComp', header: 'Workman Comp' }, { key: 'foodPlusLabour', header: 'Food Plus Labour' }]
  public displayedColumns: string[] = this.displayedColumnObject.map((column) => column.key)
  selectedRowId: any= '';
  selectedRowObj: LocationModel = { id: 0, name: '', documentId: '', dcp: 0, donut: 0, pepsi: 0, workmanComp: 0, foodPlusLabour: 0 };

  constructor(public dialog: MatDialog) {
    this.service.updateLable("Location");
    this.service.getAllLocations()
  }

  ngOnInit(): void {
  }

  getColumnDisplayName(column: string) {
    return this.displayedColumnObject.find(x => x.key == column)?.header
  }

  selectRow(row: any) { 
    
    if(row.id == this.selectedRowId) { 
      this.selectedRowId = ''
      this.selectedRowObj = { id: 0, name: '', documentId: '', dcp: 0, donut: 0, pepsi: 0, workmanComp: 0, foodPlusLabour: 0}
      return
    }

    this.selectedRowId = row.documentId
    this.selectedRowObj = row
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.getAllLocations()
      }
    });
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(EditDialogComponent, { data: Object.assign({}, this.selectedRowObj)});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.getAllLocations()
      }
    });
  }

}
