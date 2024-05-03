import { Injectable, WritableSignal, signal } from "@angular/core";
import { DBStore } from "../db-store/database.service";
import { LocationModel } from "../models/location.model";
import { PurchaseModel } from "../models/purchase.model";
import { SalesModel } from "../models/sales.model";
import { TargetModel } from "../models/target.model";
import { PayrollModel } from "../models/payroll.model";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  public componentLable: WritableSignal<string> = signal<string>('');
  public allLocations: WritableSignal<LocationModel[]> = signal<LocationModel[]>([]);
  public allPurchases: WritableSignal<PurchaseModel[]> = signal<PurchaseModel[]>([]);
  public allSales: WritableSignal<SalesModel[]> = signal<SalesModel[]>([]);
  public allTarget: WritableSignal<TargetModel[]> = signal<TargetModel[]>([]);
  public allPayroll: WritableSignal<PayrollModel[]> = signal<PayrollModel[]>([]);

  constructor(private db: DBStore) { }

  getAllLocations() {
    return this.db.getAllLocations().then((locations: LocationModel[]) => {
      this.allLocations.set(locations);
    });
  }

  getAllPurchases() {
    return this.db.getAllPurchases().then((purchases: PurchaseModel[]) => {
      let locations = purchases.map(purchase => purchase.locationId);
      this.db.getLocations(locations).then((locations: LocationModel[]) => { 
        purchases = purchases.map((purchase: PurchaseModel) => {
          let location = locations.find(location => location.documentId == purchase.locationId);
          if(location !== undefined) {
            return {
              ...purchase,
              locationId: purchase.locationId,
              locationName: location.name
            }
          } else {
            return {
              ...purchase,
              locationId: purchase.locationId, 
            }
          }
        })
        this.allPurchases.set(purchases);
      }) 
    });
  }

  getAllSales() {
    return this.db.getAllSales().then((sales: SalesModel[]) => {
      let locations = sales.map(sale => sale.locationId);
      this.db.getLocations(locations).then((locations: LocationModel[]) => { 
        sales = sales.map((sale: SalesModel) => {
          let location = locations.find(location => location.documentId == sale.locationId);
          if(location !== undefined) {
            return {
              ...sale,
              locationId: sale.locationId,
              locationName: location.name
            }
          } else {
            return {
              ...sale,
              locationId: sale.locationId, 
            }
          }
        })
        this.allSales.set(sales);
      }) 
    });
  }

  getAllTarget() {
    return this.db.getAllTarget().then((target: TargetModel[]) => {
      let locations = target.map(targetTmp => targetTmp.locationId);
      this.db.getLocations(locations).then((locations: LocationModel[]) => { 
        target = target.map((targetTmp: TargetModel) => {
          let location = locations.find(location => location.documentId == targetTmp.locationId);
          if(location !== undefined) {
            return {
              ...targetTmp,
              locationId: targetTmp.locationId,
              locationName: location.name
            }
          } else {
            return {
              ...targetTmp,
              locationId: targetTmp.locationId, 
            }
          }
        })
        this.allTarget.set(target);
      }) 
    });
  }

  getAllPayrolls() {
    return this.db.getAllPayroll().then((payroll: PayrollModel[]) => {
      let locations = payroll.map(payrollTmp => payrollTmp.locationId);
      this.db.getLocations(locations).then((locations: LocationModel[]) => { 
        payroll = payroll.map((payrollTmp: PayrollModel) => {
          let location = locations.find(location => location.documentId == payrollTmp.locationId);
          if(location !== undefined) {
            return {
              ...payrollTmp,
              locationId: payrollTmp.locationId,
              locationName: location.name
            }
          } else {
            return {
              ...payrollTmp,
              locationId: payrollTmp.locationId, 
            }
          }
        })
        this.allPayroll.set(payroll);
      }) 
    });
  }

  updateLable(lable: string) {
    return this.componentLable.set(lable);
  }

  addLocation(location: LocationModel) {
    return this.db.setLocation(location) 
  }

  editLocation(location: LocationModel) {
    return this.db.updateLocation(location)
  }
  
  addPurchase(purchase: PurchaseModel) {
    return this.db.setPurchase(purchase) 
  }

  editPurchase(purchase: PurchaseModel) {
    return this.db.updatePurchase(purchase)
  }

  addSales(sale: SalesModel) {
    return this.db.setSales(sale) 
  }

  editSales(sale: SalesModel) {
    return this.db.updateSales(sale)
  }

  addTarget(target: TargetModel) {
    return this.db.setTarget(target) 
  }

  editTarget(target: TargetModel) {
    return this.db.updateTarget(target)
  }
 
  addPayroll(payroll: PayrollModel) {
    return this.db.setPayroll(payroll) 
  }

  editPayroll(target: PayrollModel) {
    return this.db.updatePayroll(target)
  }
}
