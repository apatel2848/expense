import { Injectable, WritableSignal, signal } from "@angular/core";
import { DBStore } from "../db-store/database.service";
import { ReportModel } from "../models/report.model";
import { ColumnHeaderModel, DashboardModel } from "../models/dashboard.model";
import { Purchase } from "../models/purchase.model";
import { Sales } from "../models/sales.model";
import { TargetModel } from "../models/target.model";
import { Payroll } from "../models/payroll.model";
import { Location } from "../models/location.model";
import { forkJoin, of, switchMap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    public reportReturnData: WritableSignal<DashboardModel> = signal({
        columnHeaders: [],
        tableData: []
    });

    constructor(private db: DBStore) { }

    getReportData(startDate: any, endDate: any) {
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
        let purchaseDetails: Purchase[] = []
        let salesDetails: Sales[] = []
        let targetDetails: TargetModel[] = []
        let payrollDetails: Payroll[] = []
        let locationDetails: Location[] = []

        const observable = forkJoin({
            pData: this.db.getPurchase(startDate, endDate),
            sData: this.db.getSales(startDate, endDate),
            //tData: this.db.getTarget(startDate, endDate),
            payrollData: this.db.getPayroll(startDate, endDate)
        })

        return observable.pipe(
            switchMap(({ pData, sData, payrollData }) => {
                //purchaseDetails = pData;
                salesDetails = sData;
                //targetDetails = tData;
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
                let idx = 1;
                if (locationList.length > 0) {
                    this.db.getLocations1(locationList.filter((item, index) => locationList.indexOf(item) === index)).then((lData) => {
                        locationDetails = lData;
                        locationDetails.forEach(location => {
                            idx++;

                            let sales: any = this.sumSalesProperties(salesDetails.filter(sale => sale.locationId === location.id)!);
                            let purchase: any = this.sumPurchaseProperties(purchaseDetails.filter(purchase => purchase.locationId === location.id)!);
                            let target: TargetModel = {
                                dcp: location.dcp,
                                donut: location.donut,
                                pepsi: location.pepsi,
                                foodPlusLabour: location.foodPlusLabor,
                                workmanComp: location.workmanComp
                            };
                            let payroll: any = this.sumPayrollProperties(payrollDetails.filter(payroll => payroll.locationId === location.id)!);
                            if (sales !== undefined && purchase !== undefined && target !== undefined && payroll !== undefined) {
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
                                // if(locationList.length == idx){
                                //     allLocations.locations.push({
                                //         location: {id:0, documentId:"", name:"Total Network"},
                                //         sales: sales,
                                //         purchase: purchase,
                                //         target: target,
                                //         diff: diff,
                                //         percentage: percentage,
                                //         payroll: payroll,
                                //         totFoodCost: totFoodCost,
                                //         totFoodplusLabour: totFoodplusLabour,
                                //         dollarLostThisWeek: dollarLostThisWeek,
                                //         dollarLostThisYear: dollarLostThisYear
                                //     })
                                // }
                                this.setReportData(allLocations)
                            }
                        });
                    });
                    //let totLocation: LocationModel = { id: 0, documentId: "", name: "Total Network" };
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

    private sumPayrollProperties(items: Payroll[]): {
        expenses: number;
        managerHours: number;
        trainingHours: number;
        totalLaborHours?: number; 
        targetAmount?: number; 
        otherExpenses?: number;
        cleaning?: number;
        maintenance?: number;
        taxes?: number;
        percentOfTaxes?: number;
        workmanComp?: number; 
        totalExpenses?: number;
    } {
        return items.reduce((accumulator, currentItem) => {
            return {
                expenses: accumulator.expenses + currentItem.expenses,
                managerHours: accumulator.managerHours + currentItem.managerHours,
                trainingHours: accumulator.trainingHours + currentItem.trainingHours,
                totalLaborHours: accumulator.totalLaborHours + (currentItem.totalLaborHours ?? 0), 
                targetAmount: accumulator.targetAmount + (currentItem.targetAmount?? 0), 
                otherExpenses: accumulator.otherExpenses + (currentItem.otherExpenses?? 0), 
                maintenance: accumulator.maintenance + (currentItem.maintenance?? 0), 
                taxes: accumulator.taxes + (currentItem.taxes?? 0), 
                percentOfTaxes: accumulator.percentOfTaxes + (currentItem.percentOfTaxes?? 0), 
                workmanComp: accumulator.workmanComp + (currentItem.workmanComp?? 0), 
                totalExpenses: accumulator.totalExpenses + (currentItem.totalExpenses?? 0),
            };
        }, {
            expenses: 0,
            managerHours: 0,
            trainingHours: 0,
            totalLaborHours: 0, 
            targetAmount: 0, 
            otherExpenses: 0,
            maintenance: 0,
            taxes: 0,
            percentOfTaxes: 0,
            workmanComp: 0, 
            totalExpenses: 0,
        });
    }

    private sumPurchaseProperties(items: Purchase[]): {
        dcp: number;
        donut: number;
        pepsi: number;
    } {
        return items.reduce((accumulator, currentItem) => {
            return {
                dcp: accumulator.dcp + currentItem.dcp,
                donut: accumulator.donut + currentItem.donut,
                pepsi: accumulator.pepsi + currentItem.pepsi,
            };
        }, {
            dcp: 0,
            donut: 0,
            pepsi: 0
        });
    }

    private sumSalesProperties(items: Sales[]): { netSales: number } {
        return items.reduce((accumulator, currentItem) => {
            return {
                netSales: accumulator.netSales + currentItem.netSales
            };
        }, { netSales: 0 });
    }
}