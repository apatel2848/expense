import { Injectable } from "@angular/core";
import {   addDoc, collection, doc, getDocs, getFirestore, orderBy, query,  updateDoc, where, Timestamp, deleteDoc, setDoc  } from "firebase/firestore";
import { FireTable } from "../constants/tables"
import { environment } from "../../../environments/environment";
import { initializeApp } from "firebase/app";
import { getDownloadURL } from "firebase/storage";
import { Location } from "../models/location.model";
import { Sales } from "../models/sales.model";
import { Purchase } from "../models/purchase.model";
import { TargetModel } from "../models/target.model"; 
import { Payroll } from "../models/payroll.model"; 


@Injectable({
    providedIn: 'root',
})
export class DBStore {

    private app = initializeApp(environment.firebaseConfig);
    private db = getFirestore(this.app);

    //#region Delete

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

    async getLocations1(locationIds: string[]) {
        const locations = query(collection(this.db, FireTable.LOCATION_COLLECTION), where("__name__","in" , locationIds));
        const querySnapshot = await getDocs(locations);

        let allLocations: Location[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const location = documentSnapshot.data();
            // await allLocations.push({
            //     ...location,
            //     name: location['name'],
            //     id: location['id'],
            //     documentId: documentSnapshot.id,
            //     dcp: location['dcp'],
            //     donut: location['donut'],
            //     pepsi: location['pepsi'],
            //     workmanComp: location['workmanComp'],
            //     foodPlusLabour: location['foodPlusLabour']
            // })
        } 
        return allLocations;
    } 

    // async getAllLocations() {
    //     const locations = query(collection(this.db, FireTable.LOCATION_COLLECTION), orderBy("name"));
    //     const querySnapshot = await getDocs(locations);

    //     let allLocations: Location[] = [];
    //     // for (const documentSnapshot of querySnapshot.docs) {
    //     //     const location = documentSnapshot.data();
    //     //     await allLocations.push({
    //     //         ...location,
    //     //         name: location['name'],
    //     //         id: location['id'],
    //     //         documentId: documentSnapshot.id,
    //     //         dcp: location['dcp'],
    //     //         donut: location['donut'],
    //     //         pepsi: location['pepsi'],
    //     //         workmanComp: location['workmanComp'],
    //     //         foodPlusLabour: location['foodPlusLabour']
    //     //     })
    //     // } 
    //     return allLocations;
    // }

    // async updateLocation(location: Location) { 
    //     updateDoc(doc(this.db, `${FireTable.LOCATION_COLLECTION}/${location.id}`), location.toJson())
    // }

    // async setPurchase(purchase: Purchase): Promise<any> {
    //     return addDoc(collection(this.db, FireTable.PURCHASE_COLLECTION), { dateMonth: purchase.dateMonth, dcp: purchase.dcp, donut: purchase.donut, pepsi: purchase.pepsi, locationId: purchase.locationId})
    //         .then((docRef) => { 
    //             return docRef.id
    //         }) 
    // }

    async updatePurchase(purchase: Purchase) { 
        //updateDoc(doc(this.db, `${FireTable.PURCHASE_COLLECTION}/${purchase.id}`), { dateMonth: purchase.dateMonth, dcp: purchase.dcp, donut: purchase.donut, pepsi: purchase.pepsi, locationId: purchase.locationId})
    }


    async getAllPurchases() {
        const purchases = query(collection(this.db, FireTable.PURCHASE_COLLECTION));
        const querySnapshot = await getDocs(purchases);

        let allPurchases: Purchase[] = [];
        // for (const documentSnapshot of querySnapshot.docs) {
        //     const purchase = documentSnapshot.data();
        //     await allPurchases.push({
        //         ...purchase, 
        //         id: documentSnapshot.id,
                
        //         dcp: purchase['dcp'],
        //         donut: purchase['donut'],
        //         pepsi: purchase['pepsi'],
        //         locationId: purchase['locationId']
        //     })
        //} 
        return allPurchases;
    } 
    
    async getPurchaseData(dateMonth: any, locationId: string) { 
        const purchases = query(collection(this.db, FireTable.PURCHASE_COLLECTION), where("locationId", '==' , locationId), where("dateMonth", '>=' , dateMonth), where("dateMonth", '<=' , dateMonth));
        const querySnapshot = await getDocs(purchases);
 
        let allPurchases: Purchase[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const purchase = documentSnapshot.data();
            // await allPurchases.push({
            //     ...purchase, 
            //     id: documentSnapshot.id,
            //     dateMonth: purchase['dateMonth'],
            //     dcp: purchase['dcp'],
            //     donut: purchase['donut'],
            //     pepsi: purchase['pepsi'],
            //     locationId: purchase['locationId'],      
            //     locationName: ''
            // })
        } 
        return allPurchases.length > 0 ? allPurchases[0] : { id: '', dateMonth: '', dcp: 0, donut: 0, pepsi: 0, locationId: '', locationName: '' };
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

    // async setPayroll(payroll: Payroll) : Promise<any> {
    //     console.log(payroll)
    //     console.log(payroll.date)
    //     // return  addDoc(collection(this.db, FireTable.PAYROLL_COLLECTION), { dateMonth: payroll.date,  locationId: payroll.locationId, expenses: payroll.expenses, managerHours: payroll.managerHours, trainingHours: payroll.trainingHours, totalLaborHours: payroll.totalLaborHours, targetAmount: payroll.targetAmount, otherExpenses: payroll.otherExpenses, maintenance: payroll.maintenance, taxes: payroll.taxes, workmanComp: payroll.workmanComp, totalExpenses: payroll.totalExpenses, percentOfTaxes: payroll.percentOfTaxes})
    //     // .then((docRef) => { 
    //     //     return docRef.id
    //     // })
    //     return  addDoc(collection(this.db, FireTable.PAYROLL_COLLECTION), payroll)
    //     .then((docRef) => { 
    //         return docRef.id
    //     })
    // }


    // async setSales(sale: Sales): Promise<any> {
    //     return  addDoc(collection(this.db, FireTable.SALES_COLLECTION), { dateMonth: sale.date, netSales: sale.netSales, locationId: sale.locationId})
    //     .then((docRef) => { 
    //         return docRef.id
    //     })
    // }

    async updateSales(sale: Sales) { 
        updateDoc(doc(this.db, `${FireTable.SALES_COLLECTION}/${sale.id}`), { dateMonth: sale.date, netSales: sale.netSales, locationId: sale.locationId})
    }

    async getAllSales() {
        const sales = query(collection(this.db, FireTable.SALES_COLLECTION));
        const querySnapshot = await getDocs(sales);

        let allSales: Sales[] = [];
        // for (const documentSnapshot of querySnapshot.docs) {
        //     const sale = documentSnapshot.data();
        //     await allSales.push({
        //         ...sale, 
        //         id: documentSnapshot.id,
        //         netSales: sale['netSales'], 
        //         locationId: sale['locationId'],
        //         date: sale['date'],
        //         created: sale['created']
        //     })
        // } 
        return allSales;
    } 
    
    // async getSaleData(dateMonth: any, locationId: string) {
    //     const sales = query(collection(this.db, FireTable.SALES_COLLECTION), where("locationId", '==' , locationId), where("dateMonth", '>=' , dateMonth), where("dateMonth", '<=' , dateMonth));
    //     const querySnapshot = await getDocs(sales);
         
    //     let allSales: Sales[] = [];
    //     for (const documentSnapshot of querySnapshot.docs) {
    //         const sale = documentSnapshot.data();
    //         await allSales.push({
    //             ...sale, 
    //             id: documentSnapshot.id,
    //             netSales: sale['netSales'], 
    //             locationId: sale['locationId'],
    //             date: dateMonth,
    //             created: sale['created']
    //         })
    //     } 
    //     return allSales.length > 0 ? allSales[0] : new Sales();
    // }

    async getSales(startDate: any, endDate: any) {
        const sales = query(collection(this.db, FireTable.SALES_COLLECTION), where("dateMonth", '>=' , startDate), where("dateMonth", '<=' , endDate));
        const querySnapshot = await getDocs(sales);

        let allSales: Sales[] = [];
        // for (const documentSnapshot of querySnapshot.docs) {
        //     const sale = documentSnapshot.data();
        //     await allSales.push({
        //         ...sale,
        //         id: documentSnapshot.id, 
        //         locationId: sale['locationId'],
        //         netSales: sale['netSales'],
        //         date: startDate,
        //         created: sale['created']
        //     })
        // } 
        return allSales;
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

        let allPayroll: Payroll[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const payrollTmp = documentSnapshot.data();
            // await allPayroll.push({
            //     ...payrollTmp, 
            //     id: documentSnapshot.id,
            //     date: payrollTmp['date'], 
            //     created: payrollTmp['created'],
            //     locationId: payrollTmp['locationId'],  
            //     expenses: payrollTmp['expenses'],
            //     managerHours: payrollTmp['managerHours'],
            //     trainingHours: payrollTmp['trainingHours'],
            //     totalLaborHours: payrollTmp['totalLaborHours'],
            //     targetAmount: payrollTmp['targetAmount'],
            //     otherExpenses: payrollTmp['otherExpenses'], 
            //     maintenance: payrollTmp['maintenance'],
            //     taxes: payrollTmp['taxes'],
            //     workmanComp: payrollTmp['workmanComp'],
            //     totalExpenses: payrollTmp['totalExpenses'],
            //     percentOfTaxes: payrollTmp['percentOfTaxes'] 
            // })
        } 
        return allPayroll;
    }

    async getPayroll(startDate: any, endDate: any) {
        const payrolls = query(collection(this.db, FireTable.PAYROLL_COLLECTION), where("date", '==' , startDate));
        const querySnapshot = await getDocs(payrolls);

        let allPayrolls: Payroll[] = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const payroll = documentSnapshot.data();
            // await allPayrolls.push({
            //     ...payroll,
            //     created: payroll['created'],
            //     date: payroll['date'],
            //     id: documentSnapshot.id, 
            //     expenses: payroll['expenses'],
            //     locationId: payroll['locationId'],
            //     managerHours: payroll['managerHours'],
            //     trainingHours: payroll['trainingHours'],
            //     totalLaborHours: payroll['totalLaborHours'],
            //     targetAmount: payroll['targetAmount'],
            //     otherExpenses: payroll['otherExpenses'],
            //     maintenance: payroll['maintenance'],
            //     taxes: payroll['taxes'],
            //     workmanComp: payroll['workmanComp'],
            //     totalExpenses: payroll['totalExpenses'],
            //     percentOfTaxes: payroll['percentOfTaxes']
            // })
        } 
        return allPayrolls;
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

//#endregion

    //#region Payroll

    async getPayrollData(date: string, locationId: string) {
        const dbPayroll = query(collection(this.db, FireTable.PAYROLL_COLLECTION), where("locationId", '==' , locationId), where("date", '==' , date));
        const querySnapshot = await getDocs(dbPayroll);

        let payroll = new Payroll()

        if(querySnapshot.docs.length > 0)
        {
            // payroll.id = querySnapshot.docs[0].id
            // // payroll.date = querySnapshot.docs[0].data()['date']
            // // payroll.locationId = querySnapshot.docs[0].data()['locationId']
            // payroll.expenses = querySnapshot.docs[0].data()['expenses']
            // payroll.maintenance = querySnapshot.docs[0].data()['maintenance']
            // payroll.managerHours = querySnapshot.docs[0].data()['managerHours']
            // payroll.otherExpenses = querySnapshot.docs[0].data()['otherExpenses']
            // payroll.percentOfTaxes = querySnapshot.docs[0].data()['percentOfTaxes']
            // payroll.targetAmount = querySnapshot.docs[0].data()['targetAmount']
            // payroll.taxes = querySnapshot.docs[0].data()['taxes']
            // payroll.totalExpenses = querySnapshot.docs[0].data()['totalExpenses']
            // payroll.totalLaborHours = querySnapshot.docs[0].data()['totalLaborHours']

            payroll = querySnapshot.docs[0].data() as Payroll
            payroll.id = querySnapshot.docs[0].id
        }
        else 
        {
            payroll.locationId = locationId
            payroll.date = date
        }
        return payroll
    }

    async addPayroll(payroll: Payroll) : Promise<any> {
        try {
            console.log(payroll.toJson())
            return addDoc(collection(this.db, FireTable.PAYROLL_COLLECTION), payroll.toJson())
            .then((docRef) => { 
                return docRef.id
            })
        } catch (error) {
            console.error(error)
        }
    }

    async editPayroll(payroll: Payroll) { 
        try {
            console.log(payroll)
            updateDoc(doc(this.db, `${FireTable.PAYROLL_COLLECTION}/${payroll.id}`), payroll.toJson())
        } catch (error) {
            console.error(error)
        }
    }

    //#endregion

    //#region Sales

    async getSaleData(date: any, locationId: string) {
        const dbSales = query(collection(this.db, FireTable.SALES_COLLECTION), where("locationId", '==' , locationId), where("date", '==', date));
        const querySnapshot = await getDocs(dbSales);
         
        let sales = new Sales()

        if(querySnapshot.docs.length > 0)
        {
            // sales.id = querySnapshot.docs[0].id
            // sales.netSales = querySnapshot.docs[0].data()['netSales']

            sales = querySnapshot.docs[0].data() as Sales
            sales.id = querySnapshot.docs[0].id
        }
        else 
        {
            sales.locationId = locationId
            sales.date = date
        }
        return sales
    }
    
    async setSales(sales: Sales): Promise<any> {
        try {
            return  addDoc(collection(this.db, FireTable.SALES_COLLECTION), sales.toJson())
            .then((docRef) => { 
                return docRef.id
            })
        } catch (error) {
            console.error(error)
        }
    }

    //#endregion

    //#region Purchase

    async addPurchase(purchase: Purchase): Promise<any> {
        console.log(purchase)
        return addDoc(collection(this.db, FireTable.PURCHASE_COLLECTION), purchase.toJson())
        .then((docRef) => { 
            console.log(docRef.id)
            return docRef.id
        }) 
    }

    async getPurchase(date: string, locationId: string) { 
        const dbPurchase = query(collection(this.db, FireTable.PURCHASE_COLLECTION), where("locationId", '==' , locationId), where("date", '==', date));
        const querySnapshot = await getDocs(dbPurchase);

        let purchase = new Purchase()

        if(querySnapshot.docs.length > 0)
        {
            // purchase.id = querySnapshot.docs[0].id
            // purchase.donut = querySnapshot.docs[0].data()['donut']
            // purchase.dcp = querySnapshot.docs[0].data()['dcp']
            // purchase.pepsi = querySnapshot.docs[0].data()['pepsi']
            purchase = querySnapshot.docs[0].data() as Purchase
            purchase.id = querySnapshot.docs[0].id
        }
        else 
        {
            purchase.locationId = locationId
            purchase.date = date
        }

        return purchase
    }
    //#endregion

    //#region Location

    async getLocations() {
        const dbLocations = query(collection(this.db, FireTable.LOCATION_COLLECTION), orderBy("name"));
        const querySnapshot = await getDocs(dbLocations);

        let locations: Location[] = [];

        if(querySnapshot.docs.length > 0)
        {
            for (const documentSnapshot of querySnapshot.docs) {
                const location = documentSnapshot.data() as Location
                location.id = documentSnapshot.id
                locations.push(location)
            }
        }
        return locations;
    }

    async getLocation(id: string) {
        const dbLocation = query(collection(this.db, FireTable.LOCATION_COLLECTION), where("Document Name", '==' , id));
        const querySnapshot = await getDocs(dbLocation);

        if(querySnapshot.docs.length > 0)
        {
            const location = querySnapshot.docs[0].data() as Location
            location.id = querySnapshot.docs[0].id
            return location
        }
        return null;
    }

    async addLocation(location: Location): Promise<any> {
        console.log(location)
        return addDoc(collection(this.db, FireTable.LOCATION_COLLECTION), location.toJson())
        .then((docRef) => { 
            return docRef.id
        }) 
    }

    async deleteLocation(location: Location) {
        deleteDoc(doc(this.db, `${FireTable.LOCATION_COLLECTION}/${location.id}`))
    }

    async editLocation(location: Location) { 
        updateDoc(doc(this.db, `${FireTable.LOCATION_COLLECTION}/${location.id}`), location.toJson())
    }

    //#endregion
}