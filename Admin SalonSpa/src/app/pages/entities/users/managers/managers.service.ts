import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Filter, GlobalComponent } from "src/app/app.constant";
import { createRequestOption } from "src/app/shared/request.util";

@Injectable({ providedIn: "root" })
export class ManagerService {
  constructor(private http: HttpClient) {}

  getAllManagers(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `mgmts`, {
      params: options,
      observe: "response",
    });
  }

  addManagerToBranch(id?: string, manager?: any) {
    return this.http.post(GlobalComponent.API_URL_LOCAL + `mgmts`, manager);
  }

  getManagerFromBranch(id?: string, req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(
      GlobalComponent.API_URL_LOCAL + `mgmts/branches/${id}`,
      {
        params: options,
        observe: "response",
      }
    );
  }

  getManager(id?: string) {
    return this.http.get(GlobalComponent.API_URL_LOCAL + `mgmts/${id}`);
  }

  updateManager(id?: string, manager?: any) {
    return this.http.patch(
      GlobalComponent.API_URL_LOCAL + `mgmts/${id}`,
      manager
    );
  }

  deleteManager(id?: string) {
    return this.http.delete(GlobalComponent.API_URL_LOCAL + `mgmts/${id}`);
  }
}
