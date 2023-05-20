import { Component } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { ServicesService } from "../../entities/services/services.service";
import { MarketService } from "./market.service";
import {
  ServicesModel,
  StatusService,
} from "../../entities/services/services.model";
import { MarketModel } from "./market.model";
import { FormGroup, UntypedFormBuilder } from "@angular/forms";
import { Subject, debounceTime, takeUntil } from "rxjs";
import { ColorClass, Filter, FilterAll } from "src/app/app.constant";
@Component({
  selector: "app-market",
  templateUrl: "./market.component.html",
  styleUrls: ["./market.component.scss"],
  providers: [DecimalPipe],
})
export class MarketComponent {
  breadCrumbItems!: [
    { label: "Ecommerce" },
    { label: "Service"; active: true }
  ];
  objLength!: { lengthCart: number };
  searchForm!: FormGroup;
  listService: ServicesModel[] = [];
  arrayCard: MarketModel[] = [];
  isCollapsed = false;
  checkSkeleton = false;
  private destroySubject = new Subject();

  constructor(
    private service: ServicesService,
    private formBuilder: UntypedFormBuilder,
    private marketService: MarketService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [""],
    });

    this.onSearch();
    this.getListServices();
    this.arrayCard = [...(JSON.parse(localStorage.getItem("card")!) ?? [])];
    this.objLength = this.checkTotal(this.arrayCard);
  }

  getListServices(search?: string): void {
    const objQuery: Filter = FilterAll;

    search ? (objQuery.search = search) : delete objQuery.search;

    this.service.getAllServices(objQuery).subscribe({
      next: (data: any) => {
        this.listService = Object.assign([], data.users);
        this.checkSkeleton = true;
      },
      error: () => (this.checkSkeleton = false),
    });
  }

  onSearch() {
    this.searchForm
      .get("searchTerm")!
      .valueChanges.pipe(debounceTime(500), takeUntil(this.destroySubject))
      .subscribe((searchTerm) => {
        this.getListServices(searchTerm);
      });
  }

  addCard(data: MarketModel): void {
    this.arrayCard.push(data);
    const card = this.covertCaculateCard(this.arrayCard);
    this.objLength = this.checkTotal(card);
    localStorage.setItem("card", JSON.stringify(card));
    this.marketService.setCard(true);
  }

  covertCaculateCard(card: any): any {
    const uniqueProducts = card.reduce((acc: any, cur: any) => {
      const existingItem = acc.find((item: any) => item._id === cur._id);
      if (existingItem) {
        if (!existingItem.hasOwnProperty("quantity")) {
          existingItem["quantity"] = 1;
        }
        existingItem.quantity += 1;
      } else {
        if (!cur.hasOwnProperty("quantity")) {
          cur["quantity"] = 1;
        }
        acc.push({ ...cur });
      }
      return acc;
    }, []);

    return uniqueProducts;
  }

  checkTotal(data: any): any {
    let lengthCart = 0;
    data.forEach((item: any) => {
      lengthCart += item.quantity;
    });

    return {
      lengthCart,
    };
  }

  activeMenu(id: any) {
    document.querySelector(".heart_icon_" + id)?.classList.toggle("active");
  }

  checkClassStatus(status: string): string {
    switch (status) {
      case StatusService.Active:
        return ColorClass.success;
      case StatusService.Reject:
        return ColorClass.danger;
      case StatusService.Pending:
        return ColorClass.warning;
      default:
        return ColorClass.warning;
    }
  }
}
