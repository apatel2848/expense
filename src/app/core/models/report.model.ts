import { Location } from "./location.model"
import { Purchase } from "./purchase.model"
import { Sales } from "./sales.model"
import { TargetModel } from "./target.model"
import { Payroll } from "./payroll.model"

export interface ReportModel {
    rowNames: { key: string, rowValue: string }[],
    locations: {
        location: Location,
        sales: Sales,
        purchase: Purchase,
        target: TargetModel,
        payroll: Payroll,
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