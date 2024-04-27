export interface PayrollModel {
    id: string;
    locationId: string;
    expenses: number;
    managerHours: number;
    trainingHours: number;
    totalLaborHours?: number;
    //percentOfLabour: number;
    targetAmount?: number;
    //differenceOfTarget?: number;
    otherExpenses?: number;
    cleaning?: number;
    maintenance?: number;
    taxes?: number;
    percentOfTaxes?: number;
    workmanComp?: number;
    //percentOfWorkmanComp?: number;
    //targetWorkmanComp: number;
    totalExpenses?: number;
    dateMonth: string;
}