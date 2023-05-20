import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Filter, GlobalComponent } from 'src/app/app.constant';
import { createRequestOption } from '../request.util';

@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private http: HttpClient) {}

  getAllServices(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `services`, {
      params: options,
    });
  }

  getAllBranches(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `branches`, {
      params: options,
    });
  }

  getAllPosts(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `posts`, {
      params: options,
    });
  }

  getAllNotificationbyUser(id?: string, req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `notification/${id}`, {
      params: options,
    });
  }
}
