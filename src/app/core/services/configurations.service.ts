import { Injectable, WritableSignal, signal } from "@angular/core";
import { DBStore } from "../db-store/database.service";
import { LocationModel } from "../models/location.model";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  public componentLable: WritableSignal<string> = signal<string>('');
  public allLocations: WritableSignal<LocationModel[]> = signal<LocationModel[]>([]);

  constructor(private db: DBStore) { }

  getAllLocations() {
    this.db.getAllLocations().then((locations: LocationModel[]) => {
      this.allLocations.set(locations);
    });
  }

  updateLable(lable: string) {
    this.componentLable.set(lable);
  }

  addLocation(location: LocationModel) {
    this.db.setLocation(location) 
  }

  editLocation(location: LocationModel) {
    this.db.updateLocation(location)
  }
}
