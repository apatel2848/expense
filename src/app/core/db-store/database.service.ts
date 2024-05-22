import { Injectable } from "@angular/core";
import {   addDoc, collection, doc, getDocs, getFirestore, orderBy, query,  updateDoc, where, Timestamp, deleteDoc  } from "firebase/firestore";
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
                documentId: documentSnapshot.id,
                dcp: location['dcp'],
                donut: location['donut'],
                pepsi: location['pepsi'],
                workmanComp: location['workmanComp'],
                foodPlusLabour: location['foodPlusLabour']
            })
        } 
        return allLocations;
    } 

    async setLocation(location: LocationModel) {
          addDoc(collection(this.db, FireTable.LOCATION_COLLECTION), { name: location.name, id: location.id, dcp: location.dcp, donut: location.donut, pepsi: location.pepsi, workmanComp: location.workmanComp, foodPlusLabour: location.foodPlusLabour })
    }

    async deleteLocation(location: LocationModel) {
        deleteDoc(doc(this.db, `${FireTable.LOCATION_COLLECTION}/${location.documentId}`))
    }

    async updateLocation(location: LocationModel) { 
        updateDoc(doc(this.db, `${FireTable.LOCATION_COLLECTION}/${location.documentId}`), { name: location.name, id: location.id, dcp: location.dcp, donut: location.donut, pepsi: location.pepsi, workmanComp: location.workmanComp, foodPlusLabour: location.foodPlusLabour })
    }

    async setPurchase(purchase: PurchaseModel): Promise<any> {
        return addDoc(collection(this.db, FireTable.PURCHASE_COLLECTION), { dateMonth: purchase.dateMonth, dcp: purchase.dcp, donut: purchase.donut, pepsi: purchase.pepsi, locationId: purchase.locationId})
            .then((docRef) => { 
                return docRef.id
            }) 
    }

    async updatePurchase(purchase: PurchaseModel) { 
        updateDoc(doc(this.db, `${FireTable.PURCHASE_COLLECTION}/${purchase.id}`), { dateMonth: purchase.dateMonth, dcp: purchase.dcp, donut: purchase.donut, pepsi: purchase.pepsi, locationId: purchase.locationId})
    }

    async setSales(sale: SalesModel): Promise<any> {
        return  addDoc(collection(this.db, FireTable.SALES_COLLECTION), { dateMonth: sale.dateMonth, netSales: sale.netSales, locationId: sale.locationId})
        .then((docRef) => { 
            return docRef.id
        })
    }

    async updateSales(sale: SalesModel) { 
        updateDoc(doc(this.db, `${FireTable.SALES_COLLECTION}/${sale.id}`), { dateMonth: sale.dateMonth, netSales: sale.netSales, locationId: sale.locationId})
    }

    
    // async setTarget(target: TargetModel) : Promise<any> {
    //     return  addDoc(collection(this.db, FireTable.TARGET_COLLECTION), { dateMonth: target.dateMonth,  locationId: target.locationId, dcp: target.dcp, donut: target.donut, pepsi: target.pepsi, foodPlusLabour: target.foodPlusLabour, workmanComp: target.workmanComp})
    //     .then((docRef) => { 
    //         return docRef.id
    //     })
    // }

    // async updateTarget(target: TargetModel) { 
    //     updateDoc(doc(this.db, `${FireTable.TARGET_COLLECTION}/${target.id}`), { dateMonth: target.dateMonth, locationId: target.locationId, dcp: target.dcp, donut: target.donut, pepsi: target.pepsi, foodPlusLabour: target.foodPlusLabour, workmanComp: target.workmanComp})
    // }

    async setPayroll(payroll: PayrollModel) : Promise<any> {
        return  addDoc(collection(this.db, FireTable.PAYROLL_COLLECTION), { dateMonth: payroll.dateMonth,  locationId: payroll.locationId, expenses: payroll.expenses, managerHours: payroll.managerHours, trainingHours: payroll.trainingHours, totalLaborHours: payroll.totalLaborHours, targetAmount: payroll.targetAmount, otherExpenses: payroll.otherExpenses, maintenance: payroll.maintenance, taxes: payroll.taxes, workmanComp: payroll.workmanComp, totalExpenses: payroll.totalExpenses, percentOfTaxes: payroll.percentOfTaxes})
        .then((docRef) => { 
            return docRef.id
        })
    }

    async updatePayroll(payroll: PayrollModel) { 
        updateDoc(doc(this.db, `${FireTable.PAYROLL_COLLECTION}/${payroll.id}`), { dateMonth: payroll.dateMonth, locationId: payroll.locationId, expenses: payroll.expenses, managerHours: payroll.managerHours, trainingHours: payroll.trainingHours, totalLaborHours: payroll.totalLaborHours, targetAmount: payroll.targetAmount, otherExpenses: payroll.otherExpenses, maintenance: payroll.maintenance, taxes: payroll.taxes, workmanComp: payroll.workmanComp, totalExpenses: payroll.totalExpenses, percentOfTaxes: payroll.percentOfTaxes})
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
                documentId: documentSnapshot.id,
                dcp: location['dcp'],
                donut: location['donut'],
                pepsi: location['pepsi'],
                workmanComp: location['workmanComp'],
                foodPlusLabour: location['foodPlusLabour']
            })
        } 
        return allLocations;
    }

    async getAllPurchases() {
        const purchases = query(collection(this.db, FireTable.PURCHASE_COLLECTION));
        const querySnapshot = await getDocs(purchases);

        let allPurchases: PurchaseModel[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const purchase = documentSnapshot.data();
            await allPurchases.push({
                ...purchase, 
                id: documentSnapshot.id,
                dateMonth: purchase['dateMonth'],
                dcp: purchase['dcp'],
                donut: purchase['donut'],
                pepsi: purchase['pepsi'],
                locationId: purchase['locationId'],      
                locationName: ''
            })
        } 
        return allPurchases;
    } 
    
    async getPurchaseData(dateMonth: any, locationId: string) { 
        const purchases = query(collection(this.db, FireTable.PURCHASE_COLLECTION), where("locationId", '==' , locationId), where("dateMonth", '>=' , dateMonth), where("dateMonth", '<=' , dateMonth));
        const querySnapshot = await getDocs(purchases);
 
        let allPurchases: PurchaseModel[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const purchase = documentSnapshot.data();
            await allPurchases.push({
                ...purchase, 
                id: documentSnapshot.id,
                dateMonth: purchase['dateMonth'],
                dcp: purchase['dcp'],
                donut: purchase['donut'],
                pepsi: purchase['pepsi'],
                locationId: purchase['locationId'],      
                locationName: ''
            })
        } 
        return allPurchases.length > 0 ? allPurchases[0] : { id: '', dateMonth: '', dcp: 0, donut: 0, pepsi: 0, locationId: '', locationName: '' };
    }

    async getAllSales() {
        const sales = query(collection(this.db, FireTable.SALES_COLLECTION));
        const querySnapshot = await getDocs(sales);

        let allSales: SalesModel[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const sale = documentSnapshot.data();
            await allSales.push({
                ...sale, 
                id: documentSnapshot.id,
                dateMonth: sale['dateMonth'],
                netSales: sale['netSales'], 
                locationId: sale['locationId'],      
                locationName: ''
            })
        } 
        return allSales;
    } 
    
    async getSaleData(dateMonth: any, locationId: string) {
        const sales = query(collection(this.db, FireTable.SALES_COLLECTION), where("locationId", '==' , locationId), where("dateMonth", '>=' , dateMonth), where("dateMonth", '<=' , dateMonth));
        const querySnapshot = await getDocs(sales);
         
        let allSales: SalesModel[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const sale = documentSnapshot.data();
            await allSales.push({
                ...sale, 
                id: documentSnapshot.id,
                dateMonth: sale['dateMonth'],
                netSales: sale['netSales'], 
                locationId: sale['locationId'],      
                locationName: ''
            })
        } 
        return allSales.length > 0 ? allSales[0] : { id:'', dateMonth: '',  netSales: 0, locationId:'', locationName:''};
    }

    // async getAllTarget() {
    //     const target = query(collection(this.db, FireTable.TARGET_COLLECTION));
    //     const querySnapshot = await getDocs(target);

    //     let allTargets: TargetModel[] = [];
    //     for (const documentSnapshot of querySnapshot.docs) {
    //         const targetTmp = documentSnapshot.data();
    //         await allTargets.push({
    //             ...targetTmp, 
    //             id: documentSnapshot.id,
    //             dateMonth: targetTmp['dateMonth'],
    //             dcp: targetTmp['dcp'], 
    //             donut: targetTmp['donut'], 
    //             pepsi: targetTmp['pepsi'], 
    //             foodPlusLabour: targetTmp['foodPlusLabour'], 
    //             workmanComp: targetTmp['workmanComp'], 
    //             locationId: targetTmp['locationId'],      
    //             locationName: ''
    //         })
    //     } 
    //     return allTargets;
    // } 
    
    // async getTargetData(dateMonth: string, locationId: string) {
    //     const target = query(collection(this.db, FireTable.TARGET_COLLECTION), where("dateMonth", '==' , dateMonth), where("locationId", '==' , locationId));
    //     const querySnapshot = await getDocs(target);

    //     let allTargets: TargetModel[] = [];
    //     for (const documentSnapshot of querySnapshot.docs) {
    //         const targetTmp = documentSnapshot.data();
    //         await allTargets.push({
    //             ...targetTmp, 
    //             id: documentSnapshot.id,
    //             dateMonth: targetTmp['dateMonth'],
    //             dcp: targetTmp['dcp'], 
    //             donut: targetTmp['donut'], 
    //             pepsi: targetTmp['pepsi'], 
    //             foodPlusLabour: targetTmp['foodPlusLabour'], 
    //             workmanComp: targetTmp['workmanComp'], 
    //             locationId: targetTmp['locationId'],      
    //             locationName: ''
    //         })
    //     } 
    //     return allTargets.length > 0 ? allTargets[0] : { id:'', dateMonth: '', dcp: 0, donut:0, foodPlusLabour:0, pepsi:0, workmanComp: 0, locationId:'', locationName:'' };
    // }

    async getAllPayroll() {
        const payroll = query(collection(this.db, FireTable.PAYROLL_COLLECTION));
        const querySnapshot = await getDocs(payroll);

        let allPayroll: PayrollModel[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const payrollTmp = documentSnapshot.data();
            await allPayroll.push({
                ...payrollTmp, 
                id: documentSnapshot.id,
                dateMonth: payrollTmp['dateMonth'], 
                locationId: payrollTmp['locationId'],      
                locationName: '',
                expenses: payrollTmp['expenses'],
                managerHours: payrollTmp['managerHours'],
                trainingHours: payrollTmp['trainingHours'],
                totalLaborHours: payrollTmp['totalLaborHours'],
                targetAmount: payrollTmp['targetAmount'],
                otherExpenses: payrollTmp['otherExpenses'], 
                maintenance: payrollTmp['maintenance'],
                taxes: payrollTmp['taxes'],
                workmanComp: payrollTmp['workmanComp'],
                totalExpenses: payrollTmp['totalExpenses'],
                percentOfTaxes: payrollTmp['percentOfTaxes'] 
            })
        } 
        return allPayroll;
    }

    async getPayrollData(dateMonth: any, locationId: string) {
        const payroll = query(collection(this.db, FireTable.PAYROLL_COLLECTION), where("locationId", '==' , locationId), where("dateMonth", '>=' , dateMonth), where("dateMonth", '<=' , dateMonth));
        const querySnapshot = await getDocs(payroll);
         
        let allPayroll: PayrollModel[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const payrollTmp = documentSnapshot.data();
            await allPayroll.push({
                ...payrollTmp, 
                id: documentSnapshot.id,
                dateMonth: payrollTmp['dateMonth'], 
                locationId: payrollTmp['locationId'],      
                locationName: '',
                expenses: payrollTmp['expenses'],
                managerHours: payrollTmp['managerHours'],
                trainingHours: payrollTmp['trainingHours'],
                totalLaborHours: payrollTmp['totalLaborHours'],
                targetAmount: payrollTmp['targetAmount'],
                otherExpenses: payrollTmp['otherExpenses'], 
                maintenance: payrollTmp['maintenance'],
                taxes: payrollTmp['taxes'],
                workmanComp: payrollTmp['workmanComp'],
                totalExpenses: payrollTmp['totalExpenses'],
                percentOfTaxes: payrollTmp['percentOfTaxes'] 
            })
        } 
        return allPayroll.length > 0 ? allPayroll[0] : { id:'', dateMonth: '', locationId:'', locationName:'', expenses: 0, maintenance: 0, managerHours: 0, otherExpenses: 0, percentOfTaxes: 0, targetAmount: 0, taxes: 0, totalExpenses: 0, totalLaborHours: 0, trainingHours: 0, workmanComp: 0};
    }

    async getPurchase(startDate: any, endDate: any) { 
        const purchases = query(collection(this.db, FireTable.PURCHASE_COLLECTION), where("dateMonth", '>=' , startDate), where("dateMonth", '<=' , endDate));
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
                locationName: ''
            })
        } 
        return allPurchases;
    }

    async getSales(startDate: any, endDate: any) {
        const sales = query(collection(this.db, FireTable.SALES_COLLECTION), where("dateMonth", '>=' , startDate), where("dateMonth", '<=' , endDate));
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
                locationName: ''
            })
        } 
        return allSales;
    }

    // async getTarget(startDate: any, endDate: any) {
    //     const targets = query(collection(this.db, FireTable.TARGET_COLLECTION), where("dateMonth", '>=' , startDate), where("dateMonth", '<=' , endDate));
    //     const querySnapshot = await getDocs(targets);

    //     let allTargets: TargetModel[] = [];
    //     for (const documentSnapshot of querySnapshot.docs) {
    //         const target = documentSnapshot.data();
    //         await allTargets.push({
    //             ...target,
    //             dateMonth: target['dateMonth'],
    //             id: documentSnapshot.id, 
    //             dcp: target['dcp'],
    //             donut: target['donut'],
    //             locationId: target['locationId'],
    //             pepsi: target['pepsi'],
    //             foodPlusLabour: target['foodPlusLabour'],
    //             workmanComp: target['workmanComp'],
    //             locationName: ''
    //         })
    //     } 
    //     return allTargets;
    // }

    async getPayroll(startDate: any, endDate: any) {
        const payrolls = query(collection(this.db, FireTable.PAYROLL_COLLECTION), where("dateMonth", '>=' , startDate), where("dateMonth", '<=' , endDate));
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
                percentOfTaxes: payroll['percentOfTaxes'],
                locationName: ''
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