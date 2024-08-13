export class Location {
    id: string | undefined;
    created: Date = new Date();

    name: string | undefined;
    number: string | undefined;
    dcp: number = 0;
    donut: number = 0;
    pepsi: number = 0;
    workmanComp: number = 0;
    foodPlusLabor: number = 0;

    toJson()
    {
        let location =  
        {
            // id: this.id,
            created: this.created,
            name: this.name,
            number: this.number,
            dcp: this.dcp,
            donut: this.donut,
            pepsi: this.pepsi,
            workmanComp: this.workmanComp,
            foodPlusLabor: this.foodPlusLabor
        }
        return location
    }
}