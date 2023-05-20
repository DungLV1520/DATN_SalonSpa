import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { EventService } from "../../core/services/event.service";
import { AuthService } from "../../core/services/auth.service";
import { TokenStorageService } from "../../core/services/token-storage.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { LanguageService } from "../../core/services/language.service";
import { TranslateService } from "@ngx-translate/core";
import { Socket, io } from "socket.io-client";
import { GlobalComponent, RoleSpa } from "src/app/app.constant";
import { MarketService } from "src/app/pages/ecommerce/market/market.service";
import { finalize, tap } from "rxjs";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { HotToastService } from "@ngneat/hot-toast";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { NotificationService } from "src/app/pages/entities/notifications/notifications.service";

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"],
})
export class TopbarComponent implements OnInit {
  @Output() mobileMenuButtonClicked = new EventEmitter();
  @ViewChild("codemodel") codemodel!: TemplateRef<any>;
  @ViewChild("scrollRef") scrollRef: any;
  listLang = [
    { text: "English", flag: "assets/images/flags/us.svg", lang: "en" },
    { text: "Vietnam", flag: "assets/images/flags/vn.svg", lang: "vi" },
  ];
  profileForm!: UntypedFormGroup;
  passwordForm!: UntypedFormGroup;
  RoleSpa = RoleSpa;
  mode: string | undefined;
  cartData: any[] = [];
  total = 0;
  cart_length: any = 0;
  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  userData: any;
  socket!: Socket<DefaultEventsMap>;
  arrayNotification: any[] = [];
  objTotal!: any;
  param!: string;
  arrayNoti: any;
  checkTimestamp!: string;
  docRef: any;
  submitted = false;
  submittedPass = false;
  checkLoading = false;
  checkSkeleton = false;
  profileData: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: "",
    inputStyles: {
      width: "80px",
      height: "50px",
    },
  };
  code = "1234";
  email!: string;
  isProfile = false;
  userDataLocal: any;
  page = 1;
  totalPages = 0;
  totalNotification = 0;

  constructor(
    private eventService: EventService,
    public languageService: LanguageService,
    public _cookiesService: CookieService,
    public translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private marketService: MarketService,
    private toast: HotToastService,
    private offcanvasService: NgbOffcanvas,
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      fullname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ["", [Validators.required]],
      newPassword: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    });

    this.userData = this.tokenStorageService.getUser();
    this.checkLocal();

    this.cookieValue = this._cookiesService.get("lang");
    const val = this.listLang.filter((x) => x.lang === this.cookieValue);
    this.countryName = val.map((element) => element.text);

    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.valueset = this.listLang[0].flag;
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }

    this.getCardOrder();
    this.getProfile();
  }

  getNotiScroll(): void {
    this.scrollRef?.SimpleBar.getScrollElement().addEventListener(
      "scroll",
      () => {
        const scrollTop = this.scrollRef.SimpleBar.getScrollElement().scrollTop;
        const scrollHeight =
          this.scrollRef.SimpleBar.getScrollElement().scrollHeight;
        const offsetHeight =
          this.scrollRef.SimpleBar.getScrollElement().offsetHeight;
        const scroll = scrollHeight - offsetHeight;

        if (
          (Math.ceil(scrollTop) === scroll ||
            Math.floor(scrollTop) === scroll) &&
          this.page <= this.totalPages
        ) {
          this.getNotification(this.page);
        }
      }
    );
  }

  openNotification(): void {
    this.checkSkeleton = true;
    this.arrayNotification = [];
    this.getNotification(1);
    setTimeout(() => {
      this.ngAfterViewInit();
    }, 2000);
  }

  getNotification(page: number): void {
    const objQuery = { page };
    this.page = page;
    this.page++;
    this.checkLoading = true;
    const objLocal = JSON.parse(
      localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
    );
    const getAllNotiFn =
      objLocal.role === RoleSpa.ROLE_ADMIN
        ? this.notificationService.getAllNotificationForAdmin.bind(
            this.notificationService
          )
        : this.notificationService.getAllNotificationForBranch.bind(
            this.notificationService
          );

    const notification$ = getAllNotiFn(objQuery).pipe(
      tap((res: any) => {
        this.totalNotification = res.count;
        this.totalPages = res.total_page;
        this.arrayNotification = [
          ...this.arrayNotification,
          ...res.notifications,
        ];
      }),
      finalize(() => {
        this.checkLoading = false;
        this.checkSkeleton = false;
      })
    );

    notification$.subscribe();
  }

  socketBooking(profile: any): void {
    this.socket = io(GlobalComponent.SOCKET_ENDPOINT, {
      auth: {
        token: localStorage.getItem(GlobalComponent.TOKEN_KEY),
      },
    });

    const objLocal = JSON.parse(
      localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
    );

    if (objLocal?.role !== RoleSpa.ROLE_ADMIN) {
      this.socket.emit("join", profile.branch._id);
    } else {
      this.socket.emit("join", GlobalComponent.SOCKET_ROOM_ID);
    }

    this.socket.on("thread", () => {
      document.querySelector(".bx-bell")?.classList.add("bx-tada");
      document.querySelector(".bx-bell")?.classList.add("red");
      setTimeout(() => {
        document.querySelector(".bx-bell")?.classList.remove("bx-tada");
        document.querySelector(".bx-bell")?.classList.remove("red");
      }, 10000);
    });
  }

  getTimeDifference(messageTime: any): string {
    let currentTime = new Date();
    let messageDate = new Date(messageTime);
    let timeDiff = Math.abs(currentTime.getTime() - messageDate.getTime());
    // chuyển đổi khoảng thời gian thành giây
    let diffSeconds = Math.floor(timeDiff / 1000);

    if (diffSeconds < 60) {
      return diffSeconds + " sec ago";
    } else if (diffSeconds < 60 * 60) {
      let diffMinutes = Math.floor(diffSeconds / 60);
      return diffMinutes + " min ago";
    } else if (diffSeconds < 60 * 60 * 24) {
      let diffHours = Math.floor(diffSeconds / (60 * 60));
      return diffHours + " hour ago";
    } else if (diffSeconds < 60 * 60 * 24 * 7) {
      let diffDays = Math.floor(diffSeconds / (60 * 60 * 24));
      return diffDays + " day ago";
    } else if (diffSeconds < 60 * 60 * 24 * 30) {
      let diffWeeks = Math.floor(diffSeconds / (60 * 60 * 24 * 7));
      return diffWeeks + " week ago";
    } else if (diffSeconds < 60 * 60 * 24 * 365) {
      let diffMonths = Math.floor(diffSeconds / (60 * 60 * 24 * 30));
      return diffMonths + " month ago";
    } else {
      let diffYears = Math.floor(diffSeconds / (60 * 60 * 24 * 365));
      return diffYears + " year ago";
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getNotiScroll();
    }, 200);
  }

  checkLocal(): void {
    const card = JSON.parse(localStorage.getItem("card")!) ?? [];
    this.cartData = [...card];
    this.objTotal = this.checkTotal(this.cartData);
    this.userDataLocal = JSON.parse(
      localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
    );
  }

  getCardOrder(): void {
    this.marketService.saveCard.subscribe(() => {
      this.checkLocal();
    });
  }

  checkTotal(data: any): any {
    let lengthCart = 0;
    let total = 0;
    data.forEach((item: any) => {
      lengthCart += item.quantity;
      const item_price = item.quantity * item.price;
      total += item_price;
    });

    return {
      total,
      lengthCart,
    };
  }

  checkOut(): void {
    this.router.navigateByUrl("/ecommerce/cart");
  }

  toggleMobileMenu(event: any): void {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  changeMode(mode: string): void {
    this.mode = mode;
    this.eventService.broadcast("changeMode", mode);

    switch (mode) {
      case "light":
        document.body.setAttribute("data-layout-mode", "light");
        document.body.setAttribute("data-sidebar", "light");
        break;
      case "dark":
        document.body.setAttribute("data-layout-mode", "dark");
        document.body.setAttribute("data-sidebar", "dark");
        break;
      default:
        document.body.setAttribute("data-layout-mode", "light");
        break;
    }
  }

  setLanguage(text: string, lang: string, flag: string): void {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  logout(): void {
    this.router.navigate(["/auth/login"]);
    localStorage.removeItem(GlobalComponent.CARD_LOCAL_STORAGE);
    localStorage.removeItem(GlobalComponent.DISCOUNT_LOCAL_STORAGE);
    localStorage.removeItem(GlobalComponent.PERCENT_LOCAL_STORAGE);
    this.authService.logout();
  }

  windowScroll(): void {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      (document.getElementById("back-to-top") as HTMLElement).style.display =
        "block";
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display =
        "none";
    }
  }

  clearCard(): void {
    localStorage.removeItem(GlobalComponent.CARD_LOCAL_STORAGE);
    this.toast.success("Clear the card successfully", {
      duration: 3000,
      position: "top-center",
    });
  }

  openEndProfile(content: TemplateRef<any>): void {
    this.editDataGet();
    this.offcanvasService.open(content, { position: "end" });
  }

  openEndPass(content: TemplateRef<any>): void {
    this.offcanvasService.open(content, { position: "end" });
  }

  get form() {
    return this.profileForm.controls;
  }

  get formPass() {
    return this.passwordForm.controls;
  }

  saveProfile(): void {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }

    const toastRef = this.toast.loading(`Loading...`, {
      dismissible: true,
      duration: 5000,
      position: "top-center",
    });

    this.authService
      .changeProfile(this.profileForm.value)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: (res: any) => {
          if (res.code === "NEW_EMAIL") {
            this.codeModal(this.codemodel);
            this.email = this.profileForm.get("email")!.value;
          }

          this.toast.success(res.message, {
            duration: 3000,
            position: "top-center",
          });
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-center",
          });
        },
      });
  }

  getProfile(): void {
    this.isProfile = false;
    this.authService
      .getProfile()
      .pipe(finalize(() => (this.isProfile = true)))
      .subscribe({
        next: (res) => {
          this.profileData = res.staff;
          this.socketBooking(this.profileData);
        },
      });
  }

  editDataGet(): void {
    this.submitted = false;
    this.profileForm.controls["fullname"].setValue(
      this.profileData?.user?.fullname
    );
    this.profileForm.controls["email"].setValue(this.profileData?.user?.email);
    this.profileForm.controls["phone"].setValue(this.profileData?.user?.phone);
  }

  savePass(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.submittedPass = true;
    const toastRef = this.toast.loading(`Loading...`, {
      dismissible: true,
      duration: 5000,
      position: "top-center",
    });

    this.authService
      .changePassword(this.passwordForm.value)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: () => {
          this.toast.success("Password updated successfully", {
            duration: 3000,
            position: "top-center",
          });
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-center",
          });
        },
      });
  }

  /**
   * @param codemodel //
   */
  codeModal(codemodel: any): void {
    this.modalService.open(codemodel, {
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  onOtpChange(code: string) {
    this.code = code;
  }

  confirmCode(): void {
    const toastRef = this.toast.loading(`Loading...`, {
      dismissible: true,
      duration: 5000,
      position: "top-center",
    });

    const objCode = {
      code: this.code,
      email: this.email,
    };
    this.authService
      .verifyEmailProfile(objCode)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: () => {
          this.toast.success("Verify code email successfully", {
            duration: 3000,
            position: "top-center",
          });
          this.modalService.dismissAll();
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-center",
          });
        },
      });
  }

  resendOtp(): void {
    const toastRef = this.toast.loading(`Sending to ${this.email}...`, {
      dismissible: true,
      duration: 5000,
      position: "top-center",
    });
    this.authService
      .resendProfileCode(this.email)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: (res: any) => {
          this.toast.success(res.message + ` to ${this.email}`, {
            duration: 3000,
            position: "top-center",
          });
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-center",
          });
        },
      });
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
