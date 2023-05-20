import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class MarketService {
  saveCard$ = new Subject<boolean>();
  saveCard = this.saveCard$.asObservable();

  constructor(protected http: HttpClient) {}

  setCard(value: boolean): void {
    this.saveCard$.next(value);
  }
}
