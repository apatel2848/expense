import { Injectable } from "@angular/core";
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";
import { FireTable } from "../constants/tables"
import { environment } from "../../../environments/environment";
import { initializeApp } from "firebase/app"; 
import { getDownloadURL } from "firebase/storage";
import { LocationModel } from "../models/location.model";
import { SalesModel } from "../models/sales.model";
import { PurchaseModel } from "../models/purchase.model";
import { TargetModel } from "../models/target.model";
import { ReportModel } from "../models/report.model";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class DBStore {

    private app = initializeApp(environment.firebaseConfig);
    private db = getFirestore(this.app);

    async getUsers(): Promise<any[]> {
        const users = query(collection(this.db, FireTable.USERS_COLLECTION));
        const querySnapshot = await getDocs(users);

        let allUsers: any[] = [];
        querySnapshot.docs.forEach(async element => {
            const user = element.data()
            await allUsers.push({
                ...user,
                id: element.id
            })
        });

        return allUsers
    }

    async getReceipts(uid: any) {
        const receipts = query(collection(this.db, FireTable.RECEIPTS_COLLECTION), orderBy("date", "desc"));
        const querySnapshot = await getDocs(receipts);

        let allReceipts = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const receipt = documentSnapshot.data();
            await allReceipts.push({
                ...receipt,
                date: receipt['date'].toDate(),
                id: documentSnapshot.id,
                imageUrl: await getDownloadURL(receipt['imageBucket'])
            })
        }
        console.log('121313', allReceipts)
        return allReceipts;
    }

    
  generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }


    getLocationData(uid: any): Observable<ReportModel> {

        let allLocations: ReportModel = {
            rowNames:[
                {key:"sales.netSales", rowValue: "Weekly Net Sales"},
                {key:"purchase.dcp", rowValue:"Dcp Amount Purchase"},
                {key:"percentage.dcp", rowValue:"% of DCP"},
                {key:"target.dcp", rowValue:"Target DCP"},
                {key:"diff.dcp", rowValue:"Difference Of DCP"},
                {key:"purchase.donut", rowValue:"Donut Purchase"},
                {key:"percentage.donut", rowValue:"% of Donut"},
                {key:"target.donut", rowValue:"Target Donut"},
                {key:"diff.donut", rowValue:"Difference Of Donut"},
                {key:"purchase.purchase", rowValue: "Pepsi Purchase"},
                {key:"percentage.pepsi", rowValue:"% of Pepsi"},
                {key:"target.pepsi", rowValue:"Target Pepsi"},
                {key:"diff.pepsi", rowValue:"Difference Of Pepsi"},
                {key:"totFoodCost", rowValue:"Total Food Cost"}
            ],
            locations: []
        };

        let location: LocationModel = { id: "301556", name: "Brton" };

        let sales: SalesModel = { id: this.generateUUID(), locationID: location.id, netSales: 24242.57 };  

        let purchase: PurchaseModel = { id: "", locationID: "", dcp: 4460.68, donut: 1242.49, pepsi: 0 }; 

        let target: TargetModel = { id: "", locationID: location.id, dcp: 17, donut: 6.5, pepsi: 0.5 }; 

        let percentage: any = {
            dcp: ((sales.netSales / purchase.dcp) * 100).toFixed(2),
            donut: ((sales.netSales / purchase.donut) * 100).toFixed(2),
            pepsi: ((sales.netSales / purchase.pepsi) * 100).toFixed(2)
        }

        let diff: any = {
            dcp: target.dcp - percentage.dcp,
            donut: target.donut - percentage.donut,
            pepsi: target.pepsi - percentage.pepsi
        } 

        let totFoodCost = sales.netSales - purchase.donut;

        allLocations.locations.push({
            location: location,
            sales: sales,
            purchase: purchase,
            target: target,
            diff: diff,
            percentage: percentage,
            totFoodCost: totFoodCost
        })

        return of(allLocations);
    }
}