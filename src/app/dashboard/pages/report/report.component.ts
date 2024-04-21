import { Component, OnInit } from '@angular/core'; 
import { DBStore } from '../../../core/db-store/database.service';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { UserTableEntity } from '../../../core/models/user.model';
import {MatCardModule} from '@angular/material/card'
import {MatChipsModule} from '@angular/material/chips' 
import {MatFormFieldModule} from '@angular/material/form-field' 
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

 
@Component({
    selector: 'app-report',
    templateUrl: 'report.component.html',
    standalone: true,
    imports: [
      JsonPipe, MatTableModule, MatCardModule, FormsModule, ReactiveFormsModule, CurrencyPipe, MatChipsModule, MatDatepickerModule,MatFormFieldModule
    ],
    providers:[
      DBStore, provideNativeDateAdapter()
    ]
})
export class ReportComponent implements OnInit { 
  public displayedColumns: string[] = ['name', 'monthlyEmi', 'amount', 'typeOfPayment', 'status']; 
  public users: UserTableEntity[] = [] 

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private dbService: DBStore) {
    dbService.getUsers().then((data) => {
      this.users = data
    })
  }

  ngOnInit(): void {}
}
