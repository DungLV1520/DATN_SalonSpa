import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Filter, GlobalComponent } from "src/app/app.constant";
import { createRequestOption } from "src/app/shared/request.util";
import { BranchModel } from "./branches.model";

@Injectable({ providedIn: "root" })
export class BranchesService {
  constructor(private http: HttpClient) {}

  getAllBranches(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `branches`, {
      params: options,
      observe: "response",
    });
  }

  getBranchById(id?: string) {
    return this.http.get(GlobalComponent.API_URL_LOCAL + `branches/${id}`);
  }

  addBranch(branch?: BranchModel) {
    return this.http.post(GlobalComponent.API_URL_LOCAL + `branches`, branch);
  }

  updateBranch(id?: string, branch?: BranchModel) {
    return this.http.patch(
      GlobalComponent.API_URL_LOCAL + `branches/${id}`,
      branch
    );
  }

  deleteBranch(id?: string) {
    return this.http.delete(GlobalComponent.API_URL_LOCAL + `branches/${id}`);
  }
}
