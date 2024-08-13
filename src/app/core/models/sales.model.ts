export class Sales {
    id: string | undefined;
    date: string | undefined;
    locationId: string;
    created: Date;

    netSales: number;

    public constructor() {
        this.created = new Date()
        this.locationId = '';

        this.netSales = 0;
    }

    toJson()
    {
        let sales =  
        {
            // id: this.id,
            created: this.created,
            date: this.date,
            locationId: this.locationId,
            
            netSales: this.netSales
        }
        return sales
    }
}