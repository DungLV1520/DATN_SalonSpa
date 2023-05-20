import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Filter, GlobalComponent } from "src/app/app.constant";
import { createRequestOption } from "src/app/shared/request.util";
import { PaymentModel } from "../checkout/checkout.model";

@Injectable({ providedIn: "root" })
export class BillService {
  constructor(private http: HttpClient) {}

  getAllBill(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `bill`, {
      params: options,
    });
  }

  getAllMyBill(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `bill/my_bill`, {
      params: options,
    });
  }

  getBillsByBranch(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `bill/bill_branch`, {
      params: options,
    });
  }

  getDetailBill(id?: string) {
    return this.http.get(GlobalComponent.API_URL_LOCAL + `bill/${id}`);
  }

  handleBillStatus(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.post(
      GlobalComponent.API_URL_LOCAL + `bill/payment-status`,
      {},
      {
        params: options,
      }
    );
  }

  changeStatusBooking(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.post(
      GlobalComponent.API_URL_LOCAL + `bill/payment-events`,
      {},
      {
        params: options,
      }
    );
  }

  creatBillLocal(data: PaymentModel) {
    return this.http.post(GlobalComponent.API_URL_LOCAL + `bill`, data);
  }

  creatBillPayPal(data: PaymentModel) {
    return this.http.post(GlobalComponent.API_URL_LOCAL + `bill/paypal`, data);
  }

  deleteBill(id?: string) {
    return this.http.delete(GlobalComponent.API_URL_LOCAL + `bill/${id}`);
  }
}
