
export class WeekData
{
    StartDate: string | undefined
    EndDate: string | undefined
    
    static Caption: any = {
        'week': 'Week',

        //'sales.netSales': 'Weekly Net Sales',

        'totalDcp': 'DCP Purchase',
        'totalDonut': 'Donut Purchase',
        'totalPepsi': 'Pepsi Purchase',

        // 'payroll.expenses': 'Payroll Expenses',
        // 'payroll.managerHours': 'Manager Hours',
        // 'payroll.trainingHours': 'Training Hours',
        // 'payroll.totalLaborHours': 'Total Labor Hours',
        // 'payroll.targetPayrollAmount': 'Total Payroll Amount',
        // 'payroll.otherExpenses': 'Other Expenses',
        // 'payroll.cleaning': 'Cleaning',
        // 'payroll.maintenance': 'Maintenance',
        // 'payroll.taxes': 'Taxes',
        // 'payroll.percentOfTaxes': 'Percent of Taxes',
        // 'payroll.workmanComp': 'Workman Comp',

        // 'percent.donut': '% of Donut',
        // 'percent.dcp': '% of DCP',
        // 'percent.pepsi': '% of Pepsi',
        // 'percent.workmanComp': '% of Workman Comp',

        // 'diff.donut': 'Donut Difference',
        // 'diff.pepsi': 'Pepsi Difference',
        // 'diff.dcp': 'DCP Difference',
        // 'diff.target': 'Target Difference',

        // 'totFoodplusLabour': 'Food + Labor',
        // 'totalFoodCost': 'Food Cost',
        // 'dollarLostThisWeek': '$ Lost This Week',
        // 'dollarLostThisYear': '$ Lost This Year'
    } 
    
    data!: {
        'week': string

        'sales.netSales': number

        'purchase.dcp': number
        'purchase.donut': number
        'purchase.pepsi': number

        'payroll.expenses': number
        'payroll.managerHours': number
        'payroll.trainingHours': number
        'payroll.totalLaborHours': number
        'payroll.targetPayrollAmount': number
        'payroll.otherExpenses': number
        'payroll.cleaning': number
        'payroll.maintenance': number
        'payroll.taxes': number
        'payroll.percentOfTaxes': number
        'payroll.workmanComp': number

        'percent.donut': number
        'percent.dcp': number
        'percent.pepsi': number
        'percent.workmanComp': number

        'diff.donut': number
        'diff.pepsi': number
        'diff.dcp': number
        'diff.target': number

        'totFoodplusLabour': number
        'totalFoodCost': number
        'dollarLostThisWeek': number
        'dollarLostThisYear': number
    }
}

export class WeeklyFoodReport 
{
    weekData: Array<WeekData> | undefined

    constructor() 
    {
    }
}