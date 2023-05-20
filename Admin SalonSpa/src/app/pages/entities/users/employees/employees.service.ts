import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Filter, GlobalComponent } from "src/app/app.constant";
import { createRequestOption } from "src/app/shared/request.util";
import { EmployeeModel } from "./employees.model";

@Injectable({ providedIn: "root" })
export class EmployeesService {
  constructor(private http: HttpClient) {}

  getAllEmployees(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `employees`, {
      params: options,
      observe: "response",
    });
  }

  updateEmployee(id?: string, user?: EmployeeModel) {
    return this.http.patch(
      GlobalComponent.API_URL_LOCAL + `employees/${id}`,
      user
    );
  }

  deleteEmployee(id?: string) {
    return this.http.delete(GlobalComponent.API_URL_LOCAL + `employees/${id}`);
  }

  addEmployeeToBranch(id?: string, employee?: EmployeeModel) {
    return this.http.post(
      GlobalComponent.API_URL_LOCAL + `employees`,
      employee
    );
  }

  getEmployeeFromBranch(id?: string, req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(
      GlobalComponent.API_URL_LOCAL + `employees/branches/${id}`,
      {
        params: options,
        observe: "response",
      }
    );
  }

  getEmpoloyeeById(id?: string) {
    return this.http.get(GlobalComponent.API_URL_LOCAL + `employees/${id}`);
  }

  loginEmpoyee(data: { username: string; password: string }) {
    return this.http.post(GlobalComponent.API_URL_LOCAL + `employees`, data);
  }
}
