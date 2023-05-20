import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Filter, GlobalComponent } from "src/app/app.constant";
import { createRequestOption } from "src/app/shared/request.util";
import { ServicesModel } from "./services.model";

@Injectable({ providedIn: "root" })
export class ServicesService {
  constructor(private http: HttpClient) {}

  getAllServices(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `services`, {
      params: options,
    });
  }

  addServices(service?: ServicesModel) {
    return this.http.post(GlobalComponent.API_URL_LOCAL + `services`, service);
  }

  updateService(id?: string, service?: ServicesModel) {
    return this.http.patch(
      GlobalComponent.API_URL_LOCAL + `services/${id}`,
      service
    );
  }

  deleteService(id?: string) {
    return this.http.delete(GlobalComponent.API_URL_LOCAL + `services/${id}`);
  }
}
