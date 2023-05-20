import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Filter, GlobalComponent } from "src/app/app.constant";
import { createRequestOption } from "src/app/shared/request.util";
import { ContactModel } from "./contacts.model";

@Injectable({ providedIn: "root" })
export class ContactsService {
  constructor(private http: HttpClient) {}

  getAllUser(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `users`, {
      params: options,
      observe: "response",
    });
  }

  updateUser(id?: string, user?: ContactModel) {
    return this.http.patch(GlobalComponent.API_URL_LOCAL + `users/${id}`, user);
  }

  deleteUser(id?: string) {
    return this.http.delete(GlobalComponent.API_URL_LOCAL + `users/${id}`);
  }
}
