import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Clipboard } from "@angular/cdk/clipboard";
import { HotToastService } from "@ngneat/hot-toast";
import { catchError, finalize, of, switchMap } from "rxjs";
import { WizardComponent } from "angular-archwizard";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { BillService } from "../bill-admin/bills.service";
import { BranchesService } from "../../entities/branches/branches.service";
import {
  FilterAll,
  GlobalComponent,
  RoleSpa,
  TypePayment,
} from "src/app/app.constant";
import { User } from "src/app/core/models/auth.models";
import { BranchModel } from "../../entities/branches/branches.model";
import { ContactsService } from "../../entities/users/contacts/contacts.service";
import { ContactModel } from "../../entities/users/contacts/contacts.model";
import { PayPalModel, PaymentModel } from "./checkout.model";
import { MarketService } from "../market/market.service";
import { Cart } from "../cart/cart.model";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  breadCrumbItems!: [
    { label: "Ecommerce" },
    { label: "Checkout"; active: true }
  ];
  @ViewChild("wizard") private wizard!: WizardComponent;
  objLength!: { lengthCart: number; total: number };
  paypal?: PayPalModel;
  users: ContactModel[] = [];
  user?: ContactModel;
  socket!: Socket<DefaultEventsMap>;
  branchData?: BranchModel;
  readonly TypePayment = TypePayment;
  typePayment = TypePayment.CARD_CREDIT;
  RoleSpa = RoleSpa;
  objLocal!: User;
  discount!: number;
  percent!: number;
  submitted = false;
  finishOrder = true;
  showCard = true;
  checkOrderFinish = false;
  checkSkeleton = false;
  cartData: any[] = [];
  profile: any;
  userDataLocal: any;

  constructor(
    private modalService: NgbModal,
    private billService: BillService,
    private branchesService: BranchesService,
    private toast: HotToastService,
    private clipboard: Clipboard,
    private contactsService: ContactsService,
    private marketService: MarketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCard();
    this.getBranchbyEmployee();
    this.loadAllUser();
    this.userDataLocal = JSON.parse(
      localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
    );
  }

  getBranchbyEmployee(): void {
    this.checkSkeleton = false;
    this.authService
      .getProfile()
      .pipe(
        switchMap((profile) => {
          this.profile = profile.staff;
          return this.branchesService.getBranchById(
            profile?.staff?.branch?._id
          );
        }),
        finalize(() => (this.checkSkeleton = true))
      )
      .subscribe({
        next: (branchData: any) => {
          this.branchData = branchData;
        },
      });
  }

  socketIsPaymentPayPal(token?: string): void {
    this.socket = io(GlobalComponent.SOCKET_ENDPOINT, {
      auth: {
        token: localStorage.getItem(GlobalComponent.TOKEN_KEY),
      },
    });

    this.socket.emit("join", token);
    this.socket.on("thread", (res: any) => {
      if (res?.isPayment) {
        //TODO: CHECK SOCKET DONE ONLINEPAYMENT
        this.finishOrder = true;
        this.wizard.goToNextStep();
        this.removeLocalPayment();
        this.marketService.setCard(true);
      } else {
        this.finishOrder = false;
        this.wizard.goToNextStep();
      }
    });
  }

  loadAllUser(): void {
    this.contactsService
      .getAllUser(FilterAll)
      .pipe(
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((data: any) => {
        this.users = data.body.users;
      });
  }

  getDataUser(user: ContactModel): void {
    this.user = user!;
  }

  getCard(): void {
    this.cartData = JSON.parse(localStorage.getItem("card")!) ?? [];
    this.discount = JSON.parse(localStorage.getItem("discount")!) ?? 0;
    this.percent = JSON.parse(localStorage.getItem("percent")!) ?? 0;
    this.objLength = this.checkTotal(this.cartData);
  }

  checkTotal(data: Cart[]): any {
    let lengthCart = 0;
    let total = 0;
    data.forEach((item: any) => {
      lengthCart += item.quantity;
      const item_price = item.quantity * item.amount.$numberDecimal;
      total += item_price;
    });
    return {
      lengthCart,
      total,
    };
  }

  /**
   * @param content
   */
  confirm(content: any): void {
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  checkOut(): void {
    const objOrderDetail: PaymentModel = {
      totalMoney: this.objLength.total - this.discount,
      discount: this.percent,
      services: this.cartData.map((data: any) => data._id),
      typePayment: this.typePayment,
      idEmpBill: this.profile?._id,
      idMgmt: this.profile?._id,
    };

    if (this.user?._id) {
      objOrderDetail["idUser"] = this.user?._id;
    }

    const toastRef = this.toast.loading("Loading to payment for customer...", {
      duration: 5000,
      position: "top-center",
    });

    this.billService
      .creatBillLocal(objOrderDetail)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: () => {
          this.finishOrder = true;
          this.removeLocalPayment();
          this.checkOrderFinish = true;

          this.toast.success("Payment for customer successfully", {
            duration: 3000,
            position: "top-center",
          });
        },
        error: () => {
          this.finishOrder = false;
          this.toast.error("Payment for customer failed", {
            duration: 3000,
            position: "top-center",
          });
        },
      });
  }

  removeLocalPayment(): void {
    localStorage.removeItem(GlobalComponent.CARD_LOCAL_STORAGE);
    localStorage.removeItem(GlobalComponent.DISCOUNT_LOCAL_STORAGE);
    localStorage.removeItem(GlobalComponent.PERCENT_LOCAL_STORAGE);
  }

  createLinkAndQrCode(): void {
    const objOrderDetail: PaymentModel = {
      totalMoney: this.objLength.total - this.discount,
      discount: this.percent,
      services: this.cartData.map((data: any) => data._id),
      typePayment: this.typePayment,
      idEmpBill: this.profile?._id,
      idMgmt: this.profile?._id,
    };

    if (this.user?._id) {
      objOrderDetail["idUser"] = this.user?._id;
    }

    const toastRef = this.toast.loading(
      "Loading to create link and qrcode for customer...",
      {
        duration: 5000,
        position: "top-center",
      }
    );

    this.billService
      .creatBillPayPal(objOrderDetail)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: (res: any) => {
          this.paypal = res;
          const urlParams = new URLSearchParams(res.paymentUrl);
          const token = urlParams.get("token");

          this.socketIsPaymentPayPal(token!);
          this.toast.success(
            "Create link and qrcode for customer successfully",
            {
              duration: 3000,
              position: "top-center",
            }
          );
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-center",
          });
        },
      });
  }

  checkCard(check: boolean, typePayment: string): void {
    this.typePayment = typePayment as TypePayment;
    this.showCard = check;
  }

  copyToClipboard(): void {
    this.clipboard.copy(this.paypal?.paymentUrl!);
    this.toast.success("Copy success into clipboard", {
      duration: 3000,
      position: "top-center",
    });
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
