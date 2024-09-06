export class Payroll {
    id: string | undefined;
    date: string | undefined;
    locationId: string;
    created: Date;

    expense: number;
    wage: number;
    tax: number;
    workmanComp: number;
    otherExpense: number;

    // maintenance: number;
    // managerHours: number;
    // percentOfTaxes: number;
    // targetAmount: number;
    // totalExpenses: number;
    // totalLaborHours: number;
    // trainingHours: number;
    

    public constructor() {
        this.created = new Date()
        this.locationId = '';
        this.expense = 0;
        this.wage = 0;
        this.otherExpense = 0;
        this.tax = 0;
        this.workmanComp = 0;
        // this.maintenance = 0;
        // this.managerHours = 0;
        // this.percentOfTaxes = 0;
        // this.targetAmount = 0;
        // this.totalExpenses = 0;
        // this.totalLaborHours = 0;
        // this.trainingHours = 0;
    }

    toJson()
    {
        let payroll =  
        {
            // id: this.id,
            created: this.created,
            date: this.date,
            locationId: this.locationId,

            expenses: this.expense,
            wages: this.wage,
            otherExpense: this.otherExpense,
            taxes: this.tax,
            workmanComp: this.workmanComp

            // maintenance: this.maintenance,
            // managerHours: this.managerHours,
            // percentOfTaxes: this.percentOfTaxes,
            // targetAmount: this.targetAmount,
            // totalExpenses: this.totalExpenses,
            // totalLaborHours: this.totalLaborHours,
            // trainingHours: this.trainingHours
            
        }
        return payroll
    }
}