import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createRequestOption } from '../request.util';
import { Filter, GlobalComponent } from 'src/app/app.constant';
import { BookingModel } from '../model/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private http: HttpClient) {}

  getMyBooking(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `booking/my_booking`, {
      params: options,
    });
  }

  addBooking(booking?: BookingModel) {
    return this.http.post(GlobalComponent.API_URL_LOCAL + `booking`, booking);
  }

  cancelMyBooking(id: string) {
    return this.http.get(
      GlobalComponent.API_URL_LOCAL + `booking/cancel/${id}`
    );
  }
}
