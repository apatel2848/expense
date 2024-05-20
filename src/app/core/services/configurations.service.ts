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
  public dateMonth: WritableSignal<string> = signal<string>('');
  public locationId: WritableSignal<string> = signal<string>('');
  public purchase: WritableSignal<PurchaseModel> = signal<PurchaseModel>({ id: '', dateMonth: '', dcp: 0, donut: 0, pepsi: 0, locationId: '', locationName: '' });
  public sales: WritableSignal<SalesModel> = signal<SalesModel>({ id:'', dateMonth: '',  netSales: 0, locationId:'', locationName:''});
  public target: WritableSignal<TargetModel> = signal<TargetModel>({   dcp: 0, donut:0, foodPlusLabour:0, pepsi:0, workmanComp: 0 });
  public payroll: WritableSignal<PayrollModel> = signal<PayrollModel>({ id:'', dateMonth: '', locationId:'', locationName:'', expenses: 0, maintenance: 0, managerHours: 0, otherExpenses: 0, percentOfTaxes: 0, targetAmount: 0, taxes: 0, totalExpenses: 0, totalLaborHours: 0, trainingHours: 0, workmanComp: 0});

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
          if (location !== undefined) {
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

  getPurchases(dateMonth: any, locationId: string) {
     
    return this.db.getPurchaseData(dateMonth, locationId).then((purchase: PurchaseModel) => {
      purchase.dateMonth = dateMonth;
      purchase.locationId = locationId;
      this.purchase.set(purchase);
      return purchase;
    });
  }

  getSales(dateMonth: any, locationId: string) {
     
    return this.db.getSaleData(dateMonth, locationId).then((sales: SalesModel) => {
      sales.dateMonth = dateMonth;
      sales.locationId = locationId;
      this.sales.set(sales);
      return sales;
    });
  }
  
  // getTarget(dateMonth: string, locationId: string) {
  //   return this.db.getTargetData(dateMonth, locationId).then((target: TargetModel) => {
  //     target.dateMonth = dateMonth;
  //     target.locationId = locationId;
  //     this.target.set(target);
  //     return target;
  //   });
  // }
  
  getPayroll(dateMonth: any, locationId: string) {
     
    return this.db.getPayrollData(dateMonth, locationId).then((payroll: PayrollModel) => {
      payroll.dateMonth = dateMonth;
      payroll.locationId = locationId;
      this.payroll.set(payroll);
      return payroll;
    });
  }
  getAllSales() {
    return this.db.getAllSales().then((sales: SalesModel[]) => {
      let locations = sales.map(sale => sale.locationId);
      this.db.getLocations(locations).then((locations: LocationModel[]) => {
        sales = sales.map((sale: SalesModel) => {
          let location = locations.find(location => location.documentId == sale.locationId);
          if (location !== undefined) {
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
    return this.db.getAllPayroll().then((payroll: PayrollModel[]) => {
      let locations = payroll.map(payrollTmp => payrollTmp.locationId);
      this.db.getLocations(locations).then((locations: LocationModel[]) => {
        payroll = payroll.map((payrollTmp: PayrollModel) => {
          let location = locations.find(location => location.documentId == payrollTmp.locationId);
          if (location !== undefined) {
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

  addPurchase(purchase: PurchaseModel): Promise<any> {
    return this.db.setPurchase(purchase)
  }

  editPurchase(purchase: PurchaseModel) {
    return this.db.updatePurchase(purchase)
  }

  addSales(sale: SalesModel): Promise<any> {
    return this.db.setSales(sale)
  }

  editSales(sale: SalesModel) {
    return this.db.updateSales(sale)
  }

  // addTarget(target: TargetModel): Promise<any> {
  //   return this.db.setTarget(target)
  // }

  // editTarget(target: TargetModel) {
  //   return this.db.updateTarget(target)
  // }

  addPayroll(payroll: PayrollModel): Promise<any> {
    return this.db.setPayroll(payroll)
  }

  editPayroll(target: PayrollModel) {
    return this.db.updatePayroll(target)
  }
}
