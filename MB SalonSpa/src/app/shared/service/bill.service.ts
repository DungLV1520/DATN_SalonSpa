import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createRequestOption } from '../request.util';
import { Filter, GlobalComponent } from 'src/app/app.constant';

@Injectable({ providedIn: 'root' })
export class BillService {
  constructor(private http: HttpClient) {}

  getAllMyBill(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `bill/my_bill`, {
      params: options,
    });
  }
}
