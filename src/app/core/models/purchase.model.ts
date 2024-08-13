export class Purchase
{
    id: string | undefined;
    date: string | undefined;
    locationId: string;
    created: Date;

    dcp: number;
    donut: number;
    pepsi: number;

    public constructor() {
        this.created = new Date()
        this.locationId = '';

        this.dcp = 0;
        this.donut = 0;
        this.pepsi = 0;
    }

    toJson()
    {
        let purchase =  
        {
            // id: this.id,
            created: this.created,
            date: this.date,
            locationId: this.locationId,
            
            dcp: this.dcp,
            donut: this.donut,
            pepsi: this.pepsi
        }
        return purchase
    }
}