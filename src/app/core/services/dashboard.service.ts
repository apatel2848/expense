import { Injectable, WritableSignal, signal } from "@angular/core";
import { DBStore } from "../db-store/database.service";
import { ReportModel } from "../models/report.model";
import { ColumnHeaderModel, DashboardModel } from "../models/dashboard.model";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    public reportReturnData: WritableSignal<DashboardModel> = signal({
        columnHeaders: [],
        tableData: []
    });

    constructor(private db: DBStore) { }

    getReportData() {
        this.db.getLocationData("").subscribe((data) => {
            this.setReportData(data)
        });
    }

    private setReportData(reportData: ReportModel) {
        let reportColumns: any[] = [];
        let reportColumsHeaders: ColumnHeaderModel[] = [];;
        let reportRows: any[] = []

        reportColumns.push(" ");
        reportData.locations.forEach((data, idx) => {
            reportColumns.push(data.location.name + ' ' + data.location.id);
        });

        reportData.rowNames.forEach((data1, idx1) => {
            let rowData: any = {}
            reportData.locations.forEach((data, idx) => {
                rowData[idx + 1] = this.getValueFromKey(data, data1.key)
            });
            rowData[0] = data1.rowValue
            reportRows.push(rowData)
        });


        reportColumns.forEach((data, idx) => {
            reportColumsHeaders.push({ 
                id: idx.toString(),
                displayName: data,
            })
        });

        this.reportReturnData.set({
            columnHeaders: reportColumsHeaders,
            tableData: reportRows
        });
    }

    private getValueFromKey = (object: any, key: any) => {
        return key.split(".").reduce((o: any, i: any) => o[i], object);
    }

}