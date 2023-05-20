import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Filter, GlobalComponent } from "src/app/app.constant";
import { BookingModel } from "./bookings.model";
import { createRequestOption } from "src/app/shared/request.util";

@Injectable({ providedIn: "root" })
export class BookingService {
  constructor(private http: HttpClient) {}

  getAllBooking(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `booking`, {
      params: options,
    });
  }

  getMyBooking(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `booking/my_booking`, {
      params: options,
    });
  }

  addBooking(booking?: BookingModel) {
    return this.http.post(GlobalComponent.API_URL_LOCAL + `booking`, booking);
  }

  updateBooking(id?: string, booking?: BookingModel) {
    return this.http.patch(
      GlobalComponent.API_URL_LOCAL + `booking/${id}`,
      booking
    );
  }

  updateBookingIsCome(id?: string) {
    return this.http.patch(
      GlobalComponent.API_URL_LOCAL + `booking/is_come/${id}`,
      {}
    );
  }

  cancelMyBooking(id: string) {
    return this.http.get(
      GlobalComponent.API_URL_LOCAL + `booking/cancel/${id}`
    );
  }

  deleteBooking(id?: string) {
    return this.http.delete(GlobalComponent.API_URL_LOCAL + `booking/${id}`);
  }
}
