import { Injectable } from "@angular/core";
import {   addDoc, collection, doc, getDocs, getFirestore, orderBy, query,  updateDoc, where } from "firebase/firestore";
import { FireTable } from "../constants/tables"
import { environment } from "../../../environments/environment";
import { initializeApp } from "firebase/app";
import { getDownloadURL } from "firebase/storage";
import { LocationModel } from "../models/location.model";
import { SalesModel } from "../models/sales.model";
import { PurchaseModel } from "../models/purchase.model";
import { TargetModel } from "../models/target.model"; 
import { PayrollModel } from "../models/payroll.model"; 

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

    async getLocations(locationIds: string[]) {
        const locations = query(collection(this.db, FireTable.LOCATION_COLLECTION), where("__name__","in" , locationIds));
        const querySnapshot = await getDocs(locations);

        let allLocations: LocationModel[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const location = documentSnapshot.data();
            await allLocations.push({
                ...location,
                name: location['name'],
                id: location['id'],
                documentId: documentSnapshot.id
            })
        } 
        return allLocations;
    }

    async setLocation(location: LocationModel) {
          addDoc(collection(this.db, FireTable.LOCATION_COLLECTION), { name: location.name, id: location.id})
    }

    async updateLocation(location: LocationModel) { 
        updateDoc(doc(this.db, `${FireTable.LOCATION_COLLECTION}/${location.documentId}`), { name: location.name, id: location.id})
    }

    async getAllLocations() {
        const locations = query(collection(this.db, FireTable.LOCATION_COLLECTION), orderBy("name"));
        const querySnapshot = await getDocs(locations);

        let allLocations: LocationModel[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const location = documentSnapshot.data();
            await allLocations.push({
                ...location,
                name: location['name'],
                id: location['id'],
                documentId: documentSnapshot.id
            })
        } 
        return allLocations;
    }

    async getPurchase(date: any) { 
        const purchases = query(collection(this.db, FireTable.PURCHASE_COLLECTION), where("dateMonth", '==' , date));
        const querySnapshot = await getDocs(purchases);

        let allPurchases: PurchaseModel[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const purchase = documentSnapshot.data();
            await allPurchases.push({
                ...purchase,
                dateMonth: purchase['dateMonth'],
                id: documentSnapshot.id,
                dcp: purchase['dcp'],
                donut: purchase['donut'],
                pepsi: purchase['pepsi'],
                locationId: purchase['locationId'],
            })
        } 
        return allPurchases;
    }

    async getSales(date: any) {
        const sales = query(collection(this.db, FireTable.SALES_COLLECTION), where("dateMonth", '==' , date));
        const querySnapshot = await getDocs(sales);

        let allSales: SalesModel[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const sale = documentSnapshot.data();
            await allSales.push({
                ...sale,
                dateMonth: sale['dateMonth'],
                id: documentSnapshot.id, 
                locationId: sale['locationId'],
                netSales: sale['netSales'], 
            })
        } 
        return allSales;
    }

    async getTarget(date: any) {
        const targets = query(collection(this.db, FireTable.TARGET_COLLECTION), where("dateMonth", '==' , date));
        const querySnapshot = await getDocs(targets);

        let allTargets: TargetModel[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const target = documentSnapshot.data();
            await allTargets.push({
                ...target,
                dateMonth: target['dateMonth'],
                id: documentSnapshot.id, 
                dcp: target['dcp'],
                donut: target['donut'],
                locationId: target['locationId'],
                pepsi: target['pepsi'],
                foodPlusLabour: target['foodPlusLabour'],
                workmanComp: target['workmanComp']
            })
        } 
        return allTargets;
    }

    async getPayroll(date: any) {
        const payrolls = query(collection(this.db, FireTable.PAYROLL_COLLECTION), where("dateMonth", '==' , date));
        const querySnapshot = await getDocs(payrolls);

        let allPayrolls: PayrollModel[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const payroll = documentSnapshot.data();
            await allPayrolls.push({
                ...payroll,
                dateMonth: payroll['dateMonth'],
                id: documentSnapshot.id, 
                expenses: payroll['expenses'],
                locationId: payroll['locationId'],
                managerHours: payroll['managerHours'],
                trainingHours: payroll['trainingHours'],
                totalLaborHours: payroll['totalLaborHours'],
                targetAmount: payroll['targetAmount'],
                otherExpenses: payroll['otherExpenses'],
                cleaning: payroll['cleaning'],
                maintenance: payroll['maintenance'],
                taxes: payroll['taxes'],
                workmanComp: payroll['workmanComp'],
                totalExpenses: payroll['totalExpenses'],
                percentOfTaxes: payroll['percentOfTaxes']
            })
        } 
        return allPayrolls;
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
}