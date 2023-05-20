import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MarketService } from "../market/market.service";
import { Cart } from "./cart.model";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  breadCrumbItems!: [{ label: "Ecommerce" }, { label: "Cart"; active: true }];
  cartData: Cart[] = [];
  deleteId!: string;
  dataCount!: number;
  counter: any = 0;
  objLength: any;
  discountRate = 0;
  oldValue!: number;

  constructor(
    private modalService: NgbModal,
    private marketService: MarketService
  ) {}

  ngOnInit(): void {
    this.getCard();
    this.setLocalDiscount();
  }

  getCard(): void {
    this.dataCount = this.cartData.length;
    this.cartData = JSON.parse(localStorage.getItem("card")!);
    this.objLength = this.checkTotal(this.cartData);
  }

  checkTotal(data: Cart[]): any {
    let lengthCart = 0;
    let total = 0;
    data?.forEach((item: any) => {
      lengthCart += item.quantity;
      const item_price = item?.quantity * item?.amount?.$numberDecimal;
      total += item_price;
    });
    return {
      lengthCart,
      total,
    };
  }

  increment(event: any, data: any): void {
    this.counter = (
      document.getElementById("cart-" + data._id) as HTMLInputElement
    ).value;
    this.counter++;
    (document.getElementById("cart-" + data._id) as HTMLInputElement).value =
      this.counter;

    const priceselection = event.target
      .closest(".card.product")
      .querySelector(".product-line-price") as HTMLInputElement;
    const amount = event.target
      .closest(".card.product")
      .querySelector(".product-price").innerHTML;
    const Price = parseFloat(amount.replace(/,/g, "")) * this.counter;

    priceselection.innerHTML = Price.toLocaleString("en-US");
    this.objLength.lengthCart++;

    this.objLength.total =
      parseFloat(amount.replace(/,/g, "")) + this.objLength.total;

    (document.getElementById("cart-subtotal") as HTMLInputElement).innerHTML =
      this.objLength.total.toLocaleString("en-US");

    this.updateQuantity(this.objLength.total);
    this.setLocalStorage(this.cartData, data._id, true);
  }

  decrement(event: any, data: any): void {
    this.counter = (
      document.getElementById("cart-" + data._id) as HTMLInputElement
    ).value;
    if (this.counter > 1) {
      this.counter--;

      (document.getElementById("cart-" + data._id) as HTMLInputElement).value =
        this.counter;

      const priceselection = event.target
        .closest(".card.product")
        .querySelector(".product-line-price") as HTMLInputElement;
      let amount = event.target
        .closest(".card.product")
        .querySelector(".product-price").innerHTML;
      const Price = parseFloat(amount.replace(/,/g, "")) * this.counter;

      priceselection.innerHTML = Price.toLocaleString("en-US");
      this.objLength.lengthCart--;

      this.objLength.total =
        this.objLength.total - parseFloat(amount.replace(/,/g, ""));
      (document.getElementById("cart-subtotal") as HTMLInputElement).innerHTML =
        this.objLength.total.toLocaleString("en-US");

      this.updateQuantity(this.objLength.total);
      this.setLocalStorage(this.cartData, data._id, false);
    }
  }

  updateQuantity(subTotal: any): void {
    const discount = (parseFloat(subTotal) * this.discountRate) / 100;
    (document.getElementById("cart-discount") as HTMLInputElement).innerHTML =
      discount === 0
        ? discount.toLocaleString("en-US")
        : `-${discount.toLocaleString("en-US")}`;
    localStorage.setItem("discount", JSON.stringify(discount));
    localStorage.setItem("percent", JSON.stringify(this.discountRate));

    const total = parseFloat(subTotal) - discount;
    (document.getElementById("cart-total") as HTMLInputElement).innerHTML =
      total.toLocaleString("en-US");
  }

  setLocalDiscount(): void {
    const discount = JSON.parse(localStorage.getItem("discount")!) ?? 0;
    (document.getElementById("cart-discount") as HTMLInputElement).innerHTML =
      discount === 0
        ? discount.toLocaleString("en-US")
        : `-${discount.toLocaleString("en-US")}`;
    this.discountRate = JSON.parse(localStorage.getItem("percent")!) ?? 0;

    const total = this.objLength.total - discount;
    (document.getElementById("cart-total") as HTMLInputElement).innerHTML =
      total.toLocaleString("en-US");
  }

  confirm(event: any, content: any, id: string): void {
    this.deleteId = id;
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  deleteData(event: any, content: any, id: any): void {
    const itemTotal: any = (
      document
        .getElementById("cart-id" + id)
        ?.querySelector(".product-line-price") as HTMLInputElement
    ).innerHTML;

    this.objLength.total =
      this.objLength.total - parseFloat(itemTotal.replace(/,/g, ""));

    (document.getElementById("cart-subtotal") as HTMLInputElement).innerHTML =
      this.objLength.total.toLocaleString("en-US");

    this.updateQuantity(this.objLength.total);
    this.cartData = this.cartData.filter((data) => {
      return data._id !== id;
    });

    localStorage.setItem("card", JSON.stringify(this.cartData));
    this.marketService.setCard(true);
  }

  applyDiscount($event: any): boolean {
    if (Number(this.discountRate) > 100 || Number(this.discountRate) < 0) {
      $event.preventDefault();
      this.discountRate = this.oldValue;
    } else {
      this.oldValue = Number($event?.target?.value);
    }

    this.updateQuantity(this.objLength.total);

    const charCode = $event.which ? $event.which : $event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  setLocalStorage(cartData: any, id: string, checkCall: boolean): void {
    for (let i = 0; i < cartData.length; i++) {
      if (cartData[i]._id === id) {
        checkCall ? cartData[i].quantity++ : cartData[i].quantity--;
        break;
      }
    }

    localStorage.setItem("card", JSON.stringify(cartData));
    this.marketService.setCard(true);
  }
}
