export class Payroll {
    id: string | undefined;
    date: string | undefined;
    locationId: string;
    created: Date;

    expenses: number;
    maintenance: number;
    managerHours: number;
    otherExpenses: number;
    percentOfTaxes: number;
    targetAmount: number;
    taxes: number;
    totalExpenses: number;
    totalLaborHours: number;
    trainingHours: number;
    workmanComp: number;

    public constructor() {
        this.created = new Date()
        this.locationId = '';
        this.expenses = 0;
        this.maintenance = 0;
        this.managerHours = 0;
        this.otherExpenses = 0;
        this.percentOfTaxes = 0;
        this.targetAmount = 0;
        this.taxes = 0;
        this.totalExpenses = 0;
        this.totalLaborHours = 0;
        this.trainingHours = 0;
        this.workmanComp = 0;
    }

    toJson()
    {
        let payroll =  
        {
            // id: this.id,
            created: this.created,
            date: this.date,
            locationId: this.locationId,

            expenses: this.expenses,
            maintenance: this.maintenance,
            managerHours: this.managerHours,
            otherExpenses: this.otherExpenses,
            percentOfTaxes: this.percentOfTaxes,
            targetAmount: this.targetAmount,
            taxes: this.taxes,
            totalExpenses: this.totalExpenses,
            totalLaborHours: this.totalLaborHours,
            trainingHours: this.trainingHours,
            workmanComp: this.workmanComp
        }
        return payroll
    }
}