import { Injectable, WritableSignal, signal } from "@angular/core";
import { DBStore } from "../db-store/database.service";
import { ReportModel } from "../models/report.model";
import { ColumnHeaderModel, DashboardModel } from "../models/dashboard.model";
import { PurchaseModel } from "../models/purchase.model";
import { SalesModel } from "../models/sales.model";
import { TargetModel } from "../models/target.model";
import { PayrollModel } from "../models/payroll.model";
import { LocationModel } from "../models/location.model";
import {  forkJoin, of,  switchMap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    public reportReturnData: WritableSignal<DashboardModel> = signal({
        columnHeaders: [],
        tableData: []
    }); 

    constructor(private db: DBStore) { }

    getReportData(date: any) {
        let allLocations: ReportModel = {
            rowNames: [
                { key: "sales.netSales", rowValue: "Weekly Net Sales" },
                { key: "purchase.dcp", rowValue: "Dcp Amount Purchase" },
                { key: "percentage.dcp", rowValue: "% Of DCP" },
                { key: "target.dcp", rowValue: "Target DCP" },
                { key: "diff.dcp", rowValue: "Difference Of DCP" },
                { key: "purchase.donut", rowValue: "Donut Purchase" },
                { key: "percentage.donut", rowValue: "% Of Donut" },
                { key: "target.donut", rowValue: "Target Donut" },
                { key: "diff.donut", rowValue: "Difference Of Donut" },
                { key: "purchase.purchase", rowValue: "Pepsi Purchase" },
                { key: "percentage.pepsi", rowValue: "% Of Pepsi" },
                { key: "target.pepsi", rowValue: "Target Pepsi" },
                { key: "diff.pepsi", rowValue: "Difference Of Pepsi" },
                { key: "totFoodCost", rowValue: "Total Food Cost" },
                { key: "blank", rowValue: "" },

                { key: "payroll.expenses", rowValue: "Payroll Expenses" },
                { key: "payroll.managerHours", rowValue: "Manager Hours" },
                { key: "payroll.trainingHours", rowValue: "Training Hours" },
                { key: "payroll.totalLaborHours", rowValue: "Total Labor Hours" },
                { key: "percentage.labour", rowValue: "% Of Labor" },
                { key: "payroll.targetAmount", rowValue: "Target Payroll Amount" },
                { key: "diff.payroll", rowValue: "Difference Of Target" },
                { key: "payroll.otherExpenses", rowValue: "Other Expenses" },
                { key: "payroll.cleaning", rowValue: "Cleaning" },
                { key: "payroll.maintenance", rowValue: "Maintenance" },
                { key: "payroll.taxes", rowValue: "Payroll Taxes" },
                { key: "payroll.percentOfTaxes", rowValue: "% Of Payroll Taxes" },
                { key: "payroll.workmanComp", rowValue: "Workman Comp" },
                { key: "percentage.workmanComp", rowValue: "% Of Workman Comp" },
                { key: "target.workmanComp", rowValue: "Target Workman Comp" },
                { key: "payroll.expenses", rowValue: "Total Payroll Expenses" },
                { key: "blank", rowValue: "" },

                { key: "totFoodplusLabour", rowValue: "Total Food Plus Labor" },
                { key: "target.foodPlusLabour", rowValue: "Target Food Plus Labour" },
                { key: "diff.diffOfTarget", rowValue: "Difference Of Target" },
                { key: "dollarLostThisWeek", rowValue: "Dollar Lost This Week" },
                { key: "dollarLostThisYear", rowValue: "Dollar Lost This Year" }, 
            ],
            locations: []
        };
   
        let locationList: string[] = []; 
        let purchaseDetails: PurchaseModel[] = []
        let salesDetails: SalesModel[] = []
        let targetDetails: TargetModel[] = []
        let payrollDetails: PayrollModel[] = [] 
        let locationDetails: LocationModel[] = [] 

        const observable = forkJoin({        
            pData: this.db.getPurchase(date),
            sData: this.db.getSales(date),
            tData: this.db.getTarget(date),
            payrollData: this.db.getPayroll(date)
        }) 

        return observable.pipe(
            switchMap(({ pData, sData, tData, payrollData } ) => { 
                purchaseDetails = pData; 
                salesDetails = sData; 
                targetDetails = tData; 
                payrollDetails = payrollData; 
                this.getLocationIds(purchaseDetails).forEach(locationId => {
                    locationList.push(locationId);
                });
                this.getLocationIds(salesDetails).forEach(locationId => {
                    locationList.push(locationId);
                });
                this.getLocationIds(targetDetails).forEach(locationId => {
                    locationList.push(locationId);
                });
                this.getLocationIds(payrollDetails).forEach(locationId => {
                    locationList.push(locationId);
                });   
                if(locationList.length > 0){
                    this.db.getLocations(locationList.filter((item, index) => locationList.indexOf(item) === index)).then((lData) => { 
                        locationDetails = lData; 
                        locationDetails.forEach(location => {

                            let sales: SalesModel = salesDetails.find(sale => sale.locationId === location.documentId)!;
                            let purchase: PurchaseModel = purchaseDetails.find(purchase => purchase.locationId === location.documentId)!;
                            let target: TargetModel = targetDetails.find(target => target.locationId === location.documentId)!;
                            let payroll: PayrollModel = payrollDetails.find(payroll => payroll.locationId === location.documentId)!;            
                
                            let percentage: any = {
                                dcp: ((sales.netSales / purchase.dcp) * 100).toFixed(2),
                                donut: ((sales.netSales / purchase.donut) * 100).toFixed(2),
                                pepsi: ((sales.netSales / purchase.pepsi) * 100).toFixed(2),
                                labour: ((payroll.expenses / sales.netSales) * 100).toFixed(2),
                                workmanComp: 0
                            }
                    
                            let diff: any = {
                                dcp: target.dcp - percentage.dcp,
                                donut: target.donut - percentage.donut,
                                pepsi: target.pepsi - percentage.pepsi,
                                payroll: 0,
                                diffOfTarget: 0
                            }
                    
                            let totFoodCost = sales.netSales - purchase.donut;
                            let totFoodplusLabour = 0;
                            let dollarLostThisWeek = 0;
                            let dollarLostThisYear = 0;
                    
                            payroll.totalExpenses = percentage.labour;
                    
                            allLocations.locations.push({
                                location: location,
                                sales: sales,
                                purchase: purchase,
                                target: target,
                                diff: diff,
                                percentage: percentage,
                                payroll: payroll,
                                totFoodCost: totFoodCost,
                                totFoodplusLabour: totFoodplusLabour,
                                dollarLostThisWeek: dollarLostThisWeek,
                                dollarLostThisYear: dollarLostThisYear
                            })
                            this.setReportData(allLocations) 
                        }); 
                    });
                } else { 
                    allLocations.rowNames = []
                    allLocations.locations = []
                    this.setReportData(allLocations) 
                }
                return of(allLocations)
            })
        ) 
    }

    private setReportData(reportData: ReportModel) {
        let reportColumns: any[] = [];
        let reportColumsHeaders: ColumnHeaderModel[] = [];
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

    private getLocationIds(object: any[]): string[] {
        let locationIds: string[] = [];
        object.forEach(element => {
            locationIds.push(element['locationId']);
        });
        return locationIds;
    } 
}