export interface DashboardModel {
    columnHeaders: ColumnHeaderModel[];
    tableData: any[];
}

export interface ColumnHeaderModel { 
        id: string;
        displayName: string; 
}

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
  }