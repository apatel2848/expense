export interface DashboardModel {
    columnHeaders: ColumnHeaderModel[];
    tableData: any[];
}


export interface ColumnHeaderModel { 
        id: string;
        displayName: string; 
}