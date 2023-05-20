import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Filter, GlobalComponent } from "src/app/app.constant";
import { NotificationModel } from "./notifications.model";
import { createRequestOption } from "src/app/shared/request.util";

@Injectable({ providedIn: "root" })
export class NotificationService {
  constructor(private http: HttpClient) {}

  getAllNotificationbyUser(id?: string, req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `notification/${id}`, {
      params: options,
    });
  }

  getAllNotificationForBranch(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(
      GlobalComponent.API_URL_LOCAL + `notification/all_branch`,
      {
        params: options,
      }
    );
  }

  getAllNotificationForAdmin(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(
      GlobalComponent.API_URL_LOCAL + `notification/all_manager`,
      {
        params: options,
      }
    );
  }

  addNotificationByUser(notify?: NotificationModel) {
    return this.http.post(
      GlobalComponent.API_URL_LOCAL + `notification`,
      notify
    );
  }

  addNotificationAllUser(notify?: NotificationModel) {
    return this.http.post(
      GlobalComponent.API_URL_LOCAL + `notification/all_users`,
      notify
    );
  }

  deleteNotification(id?: string) {
    return this.http.delete(
      GlobalComponent.API_URL_LOCAL + `notification/${id}`
    );
  }
}
