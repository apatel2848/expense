import { Injectable, WritableSignal, signal } from "@angular/core";
import { DBStore } from "../db-store/database.service";
import {WeekData, WeeklyFoodReport } from "../models/report.model";
import { ColumnHeaderModel, DashboardModel, PeriodicElement } from "../models/dashboard.model";
import { Purchase } from "../models/purchase.model";
import { Sales } from "../models/sales.model";
import { TargetModel } from "../models/target.model";
import { Payroll } from "../models/payroll.model";
import { Location } from "../models/location.model";
import { concat, forkJoin, groupBy, interval, mergeMap, observable, Observable, ObservableInput, of, pipe, switchMap, toArray } from "rxjs";
import moment from "moment";
import { APP_FORMATS } from "../constants/format";
import { start } from "repl";
import { map } from "@firebase/util";
import internal from "stream";
import { stringify } from "querystring";
import { endOfDay } from "date-fns";
 
@Injectable({
    providedIn: 'root'
})

export class DashboardService {
    private weeklyFoodReport = new WeeklyFoodReport();

    constructor(private db: DBStore) { 
        // moment.updateLocale("en", {
        //     week: {
        //         // Set the First day of week to Sunday
        //         dow: 0
        //     },
        // });
    }

    public getDisplayColumns(): string[]
    {
        return Object.keys(WeekData.Caption)
    }

    // public getWeeklyReportData(locationId: string, selectedMonth: number, selectedYear: number) {
    //     console.log('getting report...')

    //     // getting number of weeks in a given month
    //     const firstDayOfMonth = moment(`${selectedYear}-${selectedMonth+1}`, 'YYYY-MM-DD');
    //     const numOfDays = firstDayOfMonth.daysInMonth();
    //     let weeks = new Set();

    //     for(let i = 0; i < numOfDays; i++){
    //         const currentDay = moment(firstDayOfMonth, 'YYYY-MM-DD').add(i, 'days');
    //         weeks.add(currentDay.isoWeek());
    //     }

    //     // getting report for each week
    //     const allData: Array<any> = []
    //     let promises:Array<Observable<any>> = []

    //     // weeks.forEach((week: any) => {
    //     //     const firstDate = moment().day('Monday').year(selectedYear).week(Number(week)).format('YYYY-MM-DD');
    //     //     const lastDate = moment(firstDate).add(6, 'days').format('YYYY-MM-DD');
            
    //     //     console.log(`getting report for week - number: ${week}, startWeek: ${firstDate}, lastWeek: ${lastDate}`)

    //     //     // get data
    //     //     forkJoin({
    //     //         week: of(`week ${firstDate} to ${lastDate}`),
    //     //         purchaseData: this.db.getPurchaseByDateRange(locationId, firstDate, lastDate),
    //     //         salesData: this.db.getSalesByDateRange(locationId, firstDate, lastDate),
    //     //         payrollData: this.db.getPayrollByDateRange(locationId, firstDate, lastDate)
    //     //     }).subscribe(x => {
    //     //         let row = {
    //     //             week: x.week,
    //     //             totalDonut: x.purchaseData.donut,
    //     //             totalPepsi:  x.purchaseData.pepsi,
    //     //             totalDcp: x.purchaseData.dcp
    //     //         }
    //     //         console.log(row)
    //     //         allData.push(row)
    //     //     })
    //     // })

    //     weeks.forEach((week: any) => {
    //         const firstDate = moment().day('Monday').year(selectedYear).week(Number(week)).format('YYYY-MM-DD');
    //         const lastDate = moment(firstDate).add(6, 'days').format('YYYY-MM-DD');
            
    //         console.log(`getting report for week - number: ${week}, startWeek: ${firstDate}, lastWeek: ${lastDate}`)

    //         // get data
    //         let weekObservable = forkJoin({
    //             week: of(`week ${firstDate} to ${lastDate}`),
    //             purchaseData: this.db.getPurchaseByDateRange(locationId, firstDate, lastDate),
    //             salesData: this.db.getSalesByDateRange(locationId, firstDate, lastDate),
    //             payrollData: this.db.getPayrollByDateRange(locationId, firstDate, lastDate)
    //         })
    //         promises.push(weekObservable)
    //     })
    //     return forkJoin(promises)
    // }


    public getWeeklyReportData(locationId: string, selectedMonth: number, selectedYear: number) {
        console.log('getting report...')

        //getting promises
        return this.getPurchasesByWeek(locationId, selectedMonth, selectedYear)
    }

    private getPurchasesByWeek(locationId: string, selectedMonth: number, selectedYear: number) 
    {
        const monthMoment = moment().set('year', selectedYear).set('month', selectedMonth)
        const firstDayOfMonth = monthMoment.startOf('month').format('YYYY-MM-DD')
        const lastDayOfMonth = monthMoment.endOf('month').format('YYYY-MM-DD')

        console.log(firstDayOfMonth + '  ...  ' + lastDayOfMonth)

        const numOfDays = monthMoment.daysInMonth();
        let weeks = new Set();

        for(let i = 0; i < numOfDays; i++){
            const currentDay = moment(firstDayOfMonth, 'YYYY-MM-DD').add(i, 'days');
            weeks.add(currentDay.week());
        }
        // console.log(weeks)
        // console.log(firstDayOfMonth + '   ...   ' + lastDayOfMonth)

        let weeksArray = [...weeks]
        const startDate = monthMoment.week(Number(weeksArray[0])).startOf('week').format('YYYY-MM-DD');
        const endDate = monthMoment.week(Number(weeksArray[weeksArray.length-1])).endOf('week').format('YYYY-MM-DD');
        console.log(startDate + '   ...   ' + endDate)

        const observable = forkJoin({
            purchaseData: this.db.getPurchaseByDateRange(locationId, startDate, endDate),
            salesData: this.db.getSalesByDateRange(locationId, startDate, endDate),
            payrollData: this.db.getPayrollByDateRange(locationId, startDate, endDate),
            locationData: this.db.getLocation(locationId)
        })

        //get report rows and add week columns
        let reportRows = this.getReportRows(weeks, monthMoment)
        console.log('reportRows')
        console.log(reportRows)

        return observable.pipe(
            switchMap(({payrollData, salesData, purchaseData, locationData}) => {

                let payrollGroups = this.groupedByISOWeek(payrollData)
                console.log(payrollGroups)

                let salesGroups = this.groupedByISOWeek(salesData)
                console.log(salesGroups)

                let purchaseGroups = this.groupedByISOWeek(purchaseData)
                console.log(purchaseGroups)

                console.log('location: ' + locationData)
                
                weeks.forEach((week:any) => {
                    
                    let netSales = 0
                    let foodCostPercent = 0
                    let laborPercent = 0
                    let USDollar = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    });

                    const key = `week${week}`

                    //net sales
                    var row = reportRows['netSales']
                    if(week in salesGroups)
                        netSales = salesGroups[week].reduce((a: any,b: any) => a + b.netSales, 0)
                    else
                        row[key] = 0
                    
                    row[key] = USDollar.format(netSales)

                    if(week in purchaseGroups)
                    {
                        // DCP Purchase
                        var row = reportRows['dcpPurchase']
                        var dcpPurchase = purchaseGroups[week].reduce((a: any,b: any) => a + b.dcp, 0)
                        row[key] = USDollar.format(dcpPurchase)

                        // Percent of DCP Purchase
                        var row = reportRows['dcpPurchasePercent']
                        var dcpPercent = netSales > 0 ? ((dcpPurchase/netSales)*100) : 0
                        row[key] = dcpPercent.toFixed(2) + '%'

                        // Target DCP
                        var row = reportRows['dcpTarget']
                        var dcpTarget = (locationData?.dcp ?? 0) 
                        row[key] = dcpTarget.toFixed(2) + '%'

                        // Target DCP Difference
                        var row = reportRows['dcpTargetDiff']
                        var dcpTargetDiff = dcpTarget - dcpPercent
                        row[key] = dcpTargetDiff.toFixed(2) + '%'



                        // Donut Purchase
                        var row = reportRows['donutPurchase']
                        var donutPurchase = purchaseGroups[week].reduce((a: any,b: any) => a + b.donut, 0)
                        row[key] = USDollar.format(donutPurchase)
                        
                       // Percent of Donut Purchase
                       var row = reportRows['donutPurchasePercent']
                       var donutPercent = netSales > 0 ? ((donutPurchase/netSales)*100) : 0
                       row[key] = donutPercent.toFixed(2) + '%'

                       // Target Donut
                       var row = reportRows['donutTarget']
                       var donutTarget = (locationData?.donut ?? 0) 
                       row[key] = donutTarget.toFixed(2) + '%'

                        // Target Donut Difference
                        var row = reportRows['donutTargetDiff']
                        var donutTargetDiff = donutTarget - donutPercent
                        row[key] = donutTargetDiff.toFixed(2) + '%'



                        // Pepsi Purchase
                        var row = reportRows['pepsiPurchase']
                        var pepsiPurchase = purchaseGroups[week].reduce((a: any,b: any) => a + b.pepsi, 0)
                        row[key] = USDollar.format(pepsiPurchase)

                        // Percent of Pepsi Purchase
                        var row = reportRows['pepsiPurchasePercent']
                        var pepsiPercent = netSales > 0 ? ((pepsiPurchase/netSales)*100) : 0
                        row[key] = pepsiPercent.toFixed(2) + '%'

                        // Target Pepsi
                        var row = reportRows['pepsiTarget']
                        var pepsiTarget = (locationData?.pepsi ?? 0) 
                        row[key] = pepsiTarget.toFixed(2) + '%'

                        // Target Pepsi Difference
                        var row = reportRows['pepsiTargetDiff']
                        var pepsiTargetDiff = pepsiTarget - pepsiPercent
                        row[key] = pepsiTargetDiff.toFixed(2) + '%'


                        //Total Food Cost
                        var row = reportRows['totalFoodCost']
                        var totalFoodCost = (dcpPurchase + pepsiPurchase + donutPurchase)
                        row[key] = USDollar.format(totalFoodCost)

                        //Food Cost Percent
                        var row = reportRows['totalFoodCostPercent']
                        foodCostPercent = netSales > 0 ? (totalFoodCost / netSales)*100 : 0
                        row[key] = foodCostPercent.toFixed(2) + '%'
                    }

                    if(week in payrollGroups)
                    {
                        // Payroll Wages
                        var row = reportRows['payrollWages']
                        var payrollWage = payrollGroups[week].reduce((a: any,b: any) => a + b.wages, 0)
                        row[key] = USDollar.format(payrollWage)

                        // Payroll Tax
                        var row = reportRows['payrollTax']
                        var payrollTax = payrollGroups[week].reduce((a: any,b: any) => a + b.taxes, 0)
                        row[key] = USDollar.format(payrollTax)

                        // Workman Comp
                        var row = reportRows['workmanComp']
                        var workmanComp = payrollGroups[week].reduce((a: any,b: any) => a + b.workmanComp, 0)
                        row[key] = USDollar.format(workmanComp)

                        // Other Payroll Expense
                        var row = reportRows['otherPayrollExpense']
                        var otherPayrollExpense = payrollGroups[week].reduce((a: any,b: any) => a + b.otherExpense, 0)
                        row[key] = USDollar.format(otherPayrollExpense)

                        // // Manager Hours
                        // var row = reportRows['managerHours']
                        // var managerHours = payrollGroups[week].reduce((a: any,b: any) => a + b.managerHours, 0)
                        // row[key] = USDollar.format(managerHours)

                        // // Training Hours
                        // var row = reportRows['trainingHours']
                        // var trainingHours = payrollGroups[week].reduce((a: any,b: any) => a + b.trainingHours, 0)
                        // row[key] = USDollar.format(trainingHours)

                        // Labor Hours
                        // var row = reportRows['laborHours']
                        // var laborHours = payrollGroups[week].reduce((a: any,b: any) => a + b.totalLaborHours, 0)
                        // row[key] = USDollar.format(laborHours)

                        // Payroll Percent
                        var row = reportRows['payrollPercent']
                        laborPercent = netSales > 0 ? ((otherPayrollExpense + payrollWage + payrollTax + workmanComp) / netSales)*100 : 0
                        row[key] = laborPercent.toFixed(2) + '%'

                        // Payroll Target Percent
                        var row = reportRows['payrollTargetPercent']
                        var payrollTarget = (locationData?.payroll ?? 0) 
                        row[key] = payrollTarget.toFixed(2) + '%'

                        // Payroll Target Difference
                        var row = reportRows['payrollTargetDiff']
                        var payrollTargetDiff = payrollTarget - laborPercent
                        row[key] = payrollTargetDiff.toFixed(2) + '%'
                    }

                    // Total Food + Labor Percent
                    var row = reportRows['foodPlusLaborPercent']
                    var foodPlusLaborPercent = foodCostPercent + laborPercent
                    row[key] = foodPlusLaborPercent.toFixed(2) + '%'

                    // Target Food + Labor
                    var row = reportRows['foodPlusLaborTarget']
                    var foodPlusLaborTarget = (locationData?.foodPlusLabor ?? 0) 
                    row[key] = foodPlusLaborTarget + '%'
                    
                    // Target Food + Labor Difference
                    var row = reportRows['foodPlusLaborTargetDiff']
                    var foodPlusLaborTargetDiff = foodPlusLaborPercent - foodPlusLaborTarget
                    row[key] = foodPlusLaborTargetDiff.toFixed(2) + '%'
                    

                    //Dollar Lost This Week
                    var row = reportRows['dollarLostThisWeek']
                    var dollarLost = (foodPlusLaborTargetDiff > 0) ? foodPlusLaborTargetDiff/100 * netSales : 0
                    row[key] = USDollar.format(dollarLost)

                    //Yearly Lost
                    var row = reportRows['yearlyLoss']
                    var yearlyLoss = dollarLost*52
                    row[key] = USDollar.format(yearlyLoss)
                })

                console.log('end')
                const report = Object.values(reportRows)
                console.log(report)
                return of(report)
            })
        )
    }

    private groupedByISOWeek(collection: any[])
    {
        let groups = collection.reduce(
            (result:any, currentValue:any) => { 
              (result[moment(currentValue['date'], 'YYYY-MM-DD').isoWeek()] = result[moment(currentValue['date'], 'YYYY-MM-DD').isoWeek()] || []).push(currentValue);
              return result;
            }, {});
        return groups
    }

    private getReportRows(weeks: Set<unknown>, monthMoment: moment.Moment)
    {
        let rows: {[k: string]: any} = {}

        //header row
        var headerRow: {[k: string]: any} = {header: ''};
        
        weeks.forEach(week => {
            //const firstDate = monthMoment.day('Monday').week(Number(week)).format('MM/DD');
            //const lastDate = monthMoment.add(6, 'days').format('MM/DD');

            const firstDate = monthMoment.week(Number(week)).startOf('week').format('MM/DD');
            const lastDate = monthMoment.week(Number(week)).endOf('week').format('MM/DD');
            headerRow['week' + week] = firstDate + ' to ' + lastDate
        })
        rows['headerRow']= headerRow

        //captions
        let captions = {
            netSales: 'Net Sales',
            emptyRow1: '',
            dcpPurchase: 'DCP Purchase',
            dcpPurchasePercent: 'DCP %',
            dcpTarget: 'DCP Target',
            dcpTargetDiff: 'DCP Target Difference',
            donutPurchase: 'Donut Purchase',
            donutPurchasePercent: 'Donut %',
            donutTarget: 'Donut Target',
            donutTargetDiff: 'Donut Target Difference',
            pepsiPurchase: 'Pepsi Purchase',
            pepsiPurchasePercent: 'Pepsi %',
            pepsiTarget: 'Pepsi Target',
            pepsiTargetDiff: 'Donut Target Difference',
            totalFoodCost: 'Total Food Cost',
            totalFoodCostPercent: 'Total Food Cost %',
            emptyRow2: '',
            // payrollExpense: 'Payroll Expense',
            // managerHours: 'Manager Hours',
            // trainingHours: 'Training Hours',
            // laborHours: 'Labor Hours',
            payrollWages: 'Payroll Wages',
            payrollTax: 'Payroll Tax',
            workmanComp: 'Workman Comp',
            otherPayrollExpense: 'Other Payroll Expense',
            payrollPercent: 'Payroll %',
            payrollTargetPercent: 'Payroll Target %',
            payrollTargetDiff: 'Payroll Target Difference',
            emptyRow3: '',
            foodPlusLaborPercent: 'Food + Labor %',
            foodPlusLaborTarget: 'Food + Labor Target',
            foodPlusLaborTargetDiff: 'Food + Labor Target Diff',
            emptyRow4: '',
            dollarLostThisWeek: '$ Lost This Week',
            yearlyLoss: 'Yearly Loss (if continue)'
        }

        let key: keyof typeof captions
        for(key in captions)
        {
            var dataRow: {[k: string]: any} = {header: captions[key]};

            weeks.forEach(week => {
                const weekKey = `week${week}`
                dataRow[weekKey] = ' '
            })

            rows[key] = dataRow
        }
        return rows
    }
}