import { LocationModel } from "./location.model"
import { PurchaseModel } from "./purchase.model"
import { SalesModel } from "./sales.model"
import { TargetModel } from "./target.model"
import { PayrollModel } from "./payroll.model"

export interface ReportModel {
    rowNames: { key: string, rowValue: string }[],
    locations: {
        location: LocationModel,
        sales: SalesModel,
        purchase: PurchaseModel,
        target: TargetModel,
        payroll: PayrollModel,
        diff: {
            dcp: number,
            donut: number,
            pepsi: number
        },
        percentage: {
            dcp: number,
            donut: number,
            pepsi: number
        },
        totFoodCost: number,
        totFoodplusLabour: number,
        dollarLostThisWeek: number,
        dollarLostThisYear: number
    }[]
}