import { Injectable, WritableSignal, signal } from "@angular/core";
import { DBStore } from "../db-store/database.service";
import { Location } from "../models/location.model";
import { Purchase } from "../models/purchase.model";
import { Sales } from "../models/sales.model";
import { TargetModel } from "../models/target.model";
import { Payroll } from "../models/payroll.model";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import { getuid } from "process";
import { PayrollComponent } from "../../configurations/payroll";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  public componentLable: WritableSignal<string> = signal<string>('');
  public allLocations: WritableSignal<Location[]> = signal<Location[]>([]);
  public allPurchases: WritableSignal<Purchase[]> = signal<Purchase[]>([]);
  public allSales: WritableSignal<Sales[]> = signal<Sales[]>([]);
  public allTarget: WritableSignal<TargetModel[]> = signal<TargetModel[]>([]);
  public allPayroll: WritableSignal<Payroll[]> = signal<Payroll[]>([]);
  public dateMonth: WritableSignal<string> = signal<string>('');
  public locationId: WritableSignal<string> = signal<string>('');
  public target: WritableSignal<TargetModel> = signal<TargetModel>({   dcp: 0, donut:0, foodPlusLabour:0, pepsi:0, workmanComp: 0 });

  public location: WritableSignal<Location> = signal<Location>(new Location());
  public payroll: WritableSignal<Payroll> = signal<Payroll>(new Payroll());
  public purchase: WritableSignal<Purchase> = signal<Purchase>(new Purchase());
  public sales: WritableSignal<Sales> = signal<Sales>(new Sales());

  constructor(private db: DBStore) { } 

  //#region Delete

  // getAllLocations() {
  //   return this.db.getAllLocations().then((locations: Location[]) => {
  //     this.allLocations.set(locations);
  //   });
  // }

  getAllPurchases() {
    return this.db.getAllPurchases().then((purchases: Purchase[]) => {
      let locations = purchases.map(purchase => purchase.locationId);
      this.db.getLocations1(locations).then((locations: Location[]) => {
        // purchases = purchases.map((purchase: Purchase) => {
        //   let location = locations.find(location => location.documentId == purchase.locationId);
        //   if (location !== undefined) {
        //     return {
        //       ...purchase,
        //       locationId: purchase.locationId,
        //       //locationName: location.name
        //     }
        //   } else {
        //     return {
        //       ...purchase,
        //       locationId: purchase.locationId,
        //     }
        //   }
        // })
        this.allPurchases.set(purchases);
      })
    });
  }

  // getPurchases(selectedDate: any, locationId: string) {
  //   console.log(selectedDate)
  //   return this.db.getPurchaseData(selectedDate, locationId).then((purchase: Purchase) => {
  //     //purchase.dateMonth = selectedDate;
  //     // purchase.locationId = locationId;
  //     // this.purchase.set(purchase);
  //     return purchase;
  //   });
  // }

  // getSales(dateMonth: any, locationId: string) {
     
  //   return this.db.getSaleData(dateMonth, locationId).then((sales: Sales) => {
  //     sales.locationId = locationId;
  //     this.sales.set(sales);
  //     return sales;
  //   });
  // }
  
  // getTarget(dateMonth: string, locationId: string) {
  //   return this.db.getTargetData(dateMonth, locationId).then((target: TargetModel) => {
  //     target.dateMonth = dateMonth;
  //     target.locationId = locationId;
  //     this.target.set(target);
  //     return target;
  //   });
  // }
  
  getAllSales() {
    return this.db.getAllSales().then((sales: Sales[]) => {
      let locations = sales.map(sale => sale.locationId);
      this.db.getLocations1(locations).then((locations: Location[]) => {
        // sales = sales.map((sale: Sales) => {
        //   let location = locations.find(location => location.documentId == sale.locationId);
        //   if (location !== undefined) {
        //     return {
        //       ...sale,
        //       locationId: sale.locationId,
        //       locationName: location.name
        //     }
        //   } else {
        //     return {
        //       ...sale,
        //       locationId: sale.locationId,
        //     }
        //   }
        // })
        // this.allSales.set(sales);
      })
    });
  }

  // getAllTarget() {
  //   return this.db.getAllTarget().then((target: TargetModel[]) => {
  //     let locations = target.map(targetTmp => targetTmp.locationId);
  //     this.db.getLocations(locations).then((locations: LocationModel[]) => {
  //       target = target.map((targetTmp: TargetModel) => {
  //         let location = locations.find(location => location.documentId == targetTmp.locationId);
  //         if (location !== undefined) {
  //           return {
  //             ...targetTmp,
  //             locationId: targetTmp.locationId,
  //             locationName: location.name
  //           }
  //         } else {
  //           return {
  //             ...targetTmp,
  //             locationId: targetTmp.locationId,
  //           }
  //         }
  //       })
  //       this.allTarget.set(target);
  //     })
  //   });
  // }

  getAllPayrolls() {
    return this.db.getAllPayroll().then((payroll: Payroll[]) => {
      let locations = payroll.map(payrollTmp => payrollTmp.locationId);
      this.db.getLocations1(locations).then((locations: Location[]) => {
        // payroll = payroll.map((payrollTmp: Payroll) => {
        //   let location = locations.find(location => location.documentId == payrollTmp.locationId);
        //   if (location !== undefined) {
        //     return {
        //       ...payrollTmp,
        //       locationId: payrollTmp.locationId,
        //       locationName: location.name
        //     }
        //   } else {
        //     return {
        //       ...payrollTmp,
        //       locationId: payrollTmp.locationId,
        //     }
        //   }
        // })
        // this.allPayroll.set(payroll);
      })
    });
  }

  updateLable(lable: string) {
    return this.componentLable.set(lable);
  }

  // addLocation(location: Location) {
  //   return this.db.setLocation(location)
  // }

 

  editPurchase(purchase: Purchase) {
    return this.db.updatePurchase(purchase)
  }

  editSales(sale: Sales) {
    return this.db.updateSales(sale)
  }

  // addTarget(target: TargetModel): Promise<any> {
  //   return this.db.setTarget(target)
  // }

  // editTarget(target: TargetModel) {
  //   return this.db.updateTarget(target)
  // }

  // editPayroll(target: Payroll) {
  //   return this.db.updatePayroll(target)
  // }

//#endregion

  ////////////////////

  //#region Payroll

  getPayroll(date: string, locationId: string) {
    return this.db.getPayrollData(date, locationId).then((payroll: Payroll) => {
      this.payroll.set(payroll)
      return payroll
    });
  }

  addPayroll(payroll: Payroll): Promise<any> {
    console.log(payroll)
    return this.db.addPayroll(payroll)
  }

  editPayroll(payroll: Payroll) {
    return this.db.editPayroll(payroll)
  }

  //#endregion

  //#region Sales

  addSales(sales: Sales): Promise<any> {
    console.log(sales)
    return this.db.setSales(sales)
  }

  getSales(date: string, locationId: string) {
    return this.db.getSaleData(date, locationId).then((sales: Sales) => {
      this.sales.set(sales);
      return sales;
    });
  }

  //#endregion

  //#region Purchase

  addPurchase(purchase: Purchase): Promise<any> {
    console.log(purchase)
    return this.db.addPurchase(purchase);
  }

  getPurchase(date: string, locationId: string) {
    return this.db.getPurchase(date, locationId).then((purchase: Purchase) => {
      this.purchase.set(purchase);
      return purchase;
    });
  }

  //#endregion

  //#region Location

  getLocations() {
    return this.db.getLocations().then((locations: Location[]) => {
      this.allLocations.set(locations);
    });
  }

  getLocation(id: string)
  {
    return this.db.getLocation(id).then((location: any) => {
      if(location != null)
        this.location.set(location);
    });
  }
  addLocation(location: Location) {
    return this.db.addLocation(location)
  }

  editLocation(location: Location) {
    let l = Object.assign(new Location(), location)
    return this.db.editLocation(l)
  }

  deleteLocation(location: Location) {
    return this.db.deleteLocation(location)
  }
  
  //#endregion
}
 



