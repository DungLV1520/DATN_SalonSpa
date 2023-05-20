import { DatePipe } from "@angular/common";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal, NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { HotToastService } from "@ngneat/hot-toast";
import { finalize, first, map, tap } from "rxjs";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import {
  ColorClass,
  FilterAll,
  Gender,
  GlobalComponent,
  RoleSpa,
  TypeNotify,
} from "src/app/app.constant";
import { User } from "src/app/core/models/auth.models";
import { AuthService } from "src/app/core/services/auth.service";
import { BookingService } from "src/app/pages/ecommerce/bookings/bookings.service";
import { TrackingModel } from "src/app/pages/entities/chats/chats.model";
import { ChatMessage } from "./booking.model";
import { Router } from "@angular/router";
import { BranchesService } from "src/app/pages/entities/branches/branches.service";
import { BranchModel } from "src/app/pages/entities/branches/branches.model";
import { ServicesService } from "src/app/pages/entities/services/services.service";
import { ServicesModel } from "src/app/pages/entities/services/services.model";
import { BookingStatus } from "src/app/pages/ecommerce/bookings/bookings.model";
import { NotificationService } from "src/app/pages/entities/notifications/notifications.service";
import { BillService } from "src/app/pages/ecommerce/bill-admin/bills.service";
import { StatusBill } from "src/app/pages/ecommerce/bill-admin/bill-admin.model";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";

@Component({
  selector: "app-booking",
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.scss"],
})
export class BookingComponent implements OnInit {
  @ViewChild("scrollRef") scrollRef: any;
  @ViewChild("scrollRefChat") scrollRefChat: any;
  @ViewChild("codemodel") codemodel!: TemplateRef<any>;
  @ViewChild("profilecontent") profileModel!: TemplateRef<any>;
  selectGender = Object.values(Gender);
  formSendMess!: UntypedFormGroup;
  profileForm!: UntypedFormGroup;
  signupForm!: UntypedFormGroup;
  passwordForm!: UntypedFormGroup;
  loginForm!: UntypedFormGroup;
  currentSection = "home";
  username = "SalonSpa";
  submitted = false;
  submittedSignup = false;
  submittedLogin = false;
  isCollapsed = true;
  set = "twitter";
  checkTimestamp!: string;
  showEmojiPicker = false;
  checkClassMess = false;
  checkShowChat = false;
  checkShowChatPop = false;
  submittedPass = false;
  showLoading = false;
  isProfile = false;
  emoji = "";
  objLocal!: User;
  objTracking!: TrackingModel;
  chatMessagesData: ChatMessage[] = [];
  arrayMessChat: ChatMessage[] = [];
  docRef: any;
  RoleSpa = RoleSpa;
  socket!: Socket<DefaultEventsMap>;
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
  profileData: any;
  branches: BranchModel[] = [];
  listService: ServicesModel[] = [];
  selectedDate!: Date;
  hours: Array<string> = [];
  public Collapsed = true;
  branchBooking!: BranchModel;
  serviceBooking: Array<any> = [];
  timeBooking!: string;
  timeBookingLine!: string;
  showSuccess = true;
  bookingUserData: any;
  billUserData: any;
  totalNotification = 0;
  checkSkeleton = false;
  arrayNotification: any[] = [];
  checkLoading = false;
  page = 1;
  totalPages = 0;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private bookingService: BookingService,
    private authService: AuthService,
    private db: AngularFirestore,
    private toast: HotToastService,
    private router: Router,
    private offcanvasService: NgbOffcanvas,
    private branchesService: BranchesService,
    private serviceService: ServicesService,
    private notificationService: NotificationService,
    private billService: BillService,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.objLocal = JSON.parse(
      localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
    );

    this.signupForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      fullname: ["", [Validators.required]],
      password: ["", Validators.required],
      phone: ["", Validators.required],
      agree: [false, Validators.requiredTrue],
    });

    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });

    this.formSendMess = this.formBuilder.group({
      message: ["", [Validators.required]],
    });

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

    if (this.objLocal) {
      this.getMessLast();
      this.getCheckEmitNoti();
      this.getProfile();
      this.checkShowChat = true;
      this.checkShowChat = true;
    }

    this.generateHours(0);
  }

  googleAuth() {
    return this.authLogin(new GoogleAuthProvider());
  }

  githubAuth() {
    return this.authLogin(new GithubAuthProvider());
  }

  facebookAuth() {
    return this.authLogin(new FacebookAuthProvider());
  }

  twiterAuth() {
    return this.authLogin(new TwitterAuthProvider());
  }

  authLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result: any) => {
        const token = result.user._delegate.accessToken;

        this.authService.loginFirebase(token).subscribe({
          next: (data) => {
            this.objLocal = data;
            this.toast.success("Login successfully", {
              duration: 3000,
              position: "top-center",
            });

            this.checkShowChat = true;
            this.modalService.dismissAll();
          },
          error: (error) => {
            this.toast.error(error, {
              duration: 3000,
              position: "top-center",
            });
          },
        });
      })

      .catch((error) => {
        console.log(error);
      });
  }

  getMessLast(): void {
    this.db
      .collection("chat")
      .valueChanges()
      .pipe(
        map(() => {
          this.getAllChatFireStore("", true, false);
        })
      )
      .subscribe();
  }

  getCheckEmitNoti(): void {
    this.db
      .collection("tracking-chat")
      .doc(this.objLocal._id)
      .valueChanges()
      .pipe(
        map((data) => {
          this.objTracking = data as TrackingModel;
        })
      )
      .subscribe();
  }

  getAllChatFireStore(date: any, check: boolean, checkCall: boolean) {
    if (checkCall) {
      this.docRef = this.db
        .collection("chat")
        .doc(this.objLocal._id)
        .collection("messages", (ref) =>
          ref
            .orderBy("timestamp", "desc")
            .limit(10)
            .where("timestamp", "<", date)
        );
    } else {
      this.docRef = this.db
        .collection("chat")
        .doc(this.objLocal._id)
        .collection("messages", (ref) =>
          ref.orderBy("timestamp", "desc").limit(1)
        );
    }

    this.docRef
      .valueChanges(first())
      .pipe(
        map((data: any) => {
          if (checkCall) {
            this.arrayMessChat = this.sortTimeStamp(data) ?? [];
            if (check) {
              this.chatMessagesData = [...this.arrayMessChat];
              this.checkScrollLimit();
            } else {
              this.chatMessagesData = [
                ...this.arrayMessChat,
                ...this.chatMessagesData,
              ];
              this.scrollRef.SimpleBar.getScrollElement().scrollTop += 90;
            }
          } else {
            if (this.checkTimestamp !== data[0]?.timestamp) {
              this.chatMessagesData = [...this.chatMessagesData, ...data] ?? [];
              this.checkScrollLimit();
            }
            this.checkTimestamp = data[0]?.timestamp;
          }
        })
      )
      .subscribe();
  }

  socketChat(): void {
    this.socket = io(GlobalComponent.SOCKET_ENDPOINT, {
      auth: {
        token: localStorage.getItem(GlobalComponent.TOKEN_KEY),
      },
    });

    this.socket.emit("join", this.objLocal?._id);
    this.socket.on("thread", (data: any) => {
      // if (data.align !== this.objLocal._id) {
      // if (data.obj.email !== this.objLocal.email) {
      //   // this.chatMessagesData.push(data.obj);
      //   this.checkClassMess = true;
      //   setTimeout(() => {
      //     this.checkClassMess = false;
      //   }, 7000);
      // }
    });
  }

  messageSave(): void {
    const userChatShow = document.querySelector(".user-chat");
    if (userChatShow != null) {
      userChatShow.classList.add("user-chat-show");
    }

    const message = this.formSendMess.get("message")!.value;
    let currentTime = new Date();
    let messageTime = currentTime.toISOString();

    if (this.formSendMess.valid && message) {
      const data = {
        align: this.objLocal._id,
        idUser: this.objLocal._id,
        email: this.objLocal.email,
        isRead: false,
        content: message,
        time: this.datePipe.transform(new Date(), "h:mm a"),
        timestamp: messageTime,
        type: TypeNotify.CHAT,
      };

      this.socketBooking();
      const objNotification = {
        room: GlobalComponent.SOCKET_ROOM_ID,
        data: {
          id: this.objLocal._id,
          key: GlobalComponent.SOCKET_MESSAGE,
          email: this.objLocal.email,
          content: "Have a message",
          isRead: false,
          timestamp: messageTime,
          type: TypeNotify.CHAT,
        },
      };

      this.socket.emit("messages", objNotification);
      if (!this.objTracking?.isRead) {
        this.db.collection("notify").add(objNotification.data);
        this.db
          .collection("tracking-chat")
          .doc(this.objLocal._id)
          .set(objNotification.data);
      }

      this.db
        .collection("chat")
        .doc(this.objLocal._id)
        .collection("messages")
        .add(data);

      this.getAllChatFireStore(messageTime, true, false);
      this.db.collection("chat").doc(this.objLocal._id).set(data);

      this.checkScrollLimit();
      this.socket.emit("join", this.objLocal._id);
      this.socket.emit("messages", { room: this.objLocal._id, data });

      this.formSendMess = this.formBuilder.group({
        message: null,
      });
    }

    document.querySelector(".replyCard")?.classList.remove("show");
    this.emoji = "";
    this.submitted = true;
  }

  sortTimeStamp(data: any): any {
    return data.sort((a: any, b: any) => {
      if (a.timestamp < b.timestamp) {
        return -1;
      }
      if (a.timestamp > b.timestamp) {
        return 1;
      }
      return 0;
    });
  }

  copyMessage(event: any): void {
    navigator.clipboard.writeText(
      event.target.closest(".chat-list").querySelector(".ctext-content")
        .innerHTML
    );
    (document.getElementById("copyClipBoard") as HTMLElement).style.display =
      "block";
    setTimeout(() => {
      (document.getElementById("copyClipBoard") as HTMLElement).style.display =
        "none";
    }, 1000);
  }

  openEnd(): void {
    const now = new Date();
    const isoString = now.toISOString();
    this.getAllChatFireStore(isoString, true, true);
    this.checkClassMess = false;
    this.checkShowChatPop = true;

    setTimeout(() => {
      this.scrollRef
        ? (this.scrollRef.SimpleBar.getScrollElement().scrollTop = 1000000)
        : "";
      this.ngAfterViewInit();
    }, 1000);
  }

  checkScrollLimit(): void {
    setTimeout(() => {
      this.scrollRef
        ? (this.scrollRef!.SimpleBar!.getScrollElement().scrollTop = 1000000)
        : "";
    }, 100);
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any): void {
    const { emoji } = this;
    const text = `${emoji}${event.emoji.native}`;
    this.emoji = text;
    this.showEmojiPicker = false;
  }

  onFocus(): void {
    this.showEmojiPicker = false;
  }

  closeChatMess(): void {
    this.checkShowChatPop = false;
  }

  /**
   * @param signupDataModal
   */
  signupModal(signupDataModal: any): void {
    this.submittedSignup = false;
    this.signupForm.reset();
    this.modalService.open(signupDataModal, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  /**
   * @param sectionId
   */
  onSectionChange(sectionId: string): void {
    this.currentSection = sectionId;
  }

  windowScroll(): void {
    const navbar = document.getElementById("navbar");
    if (
      document.body.scrollTop > 40 ||
      document.documentElement.scrollTop > 40
    ) {
      navbar?.classList.add("is-sticky");
    } else {
      navbar?.classList.remove("is-sticky");
    }

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

  topFunction(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  get form() {
    return this.formSendMess.controls;
  }

  get formSignup() {
    return this.signupForm.controls;
  }

  get formLogin() {
    return this.loginForm.controls;
  }

  get formPass() {
    return this.passwordForm.controls;
  }

  get formProfile() {
    return this.profileForm.controls;
  }

  signUp(): void {
    this.submittedSignup = true;
    if (this.signupForm.invalid) {
      return;
    }

    const toastRef = this.toast.loading(`Sending code to your email...`, {
      dismissible: true,
      duration: 5000,
      position: "top-center",
    });

    this.signupForm.value["gender"] = Gender.Male;
    this.signupForm.value["phone"] = this.signupForm.value["phone"].toString();
    this.authService
      .register(this.signupForm.value)
      .pipe(
        first(),
        finalize(() => toastRef.close())
      )
      .subscribe({
        next: (res: any) => {
          this.router.navigate(["/auth/twostep"], {
            queryParams: { email: res?.data?.email },
          });

          this.toast.success(res.message, {
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

  /**
   * @param loginDataModal
   */
  loginModal(loginDataModal: any): void {
    this.submittedLogin = false;
    this.loginForm.reset();
    this.modalService.open(loginDataModal, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  login(): void {
    this.submittedLogin = true;
    if (this.loginForm.invalid) {
      return;
    }

    const toastRef = this.toast.loading(`Loading...`, {
      dismissible: true,
      duration: 5000,
      position: "top-center",
    });

    this.authService
      .login(this.formLogin["email"].value, this.formLogin["password"].value)
      .pipe(
        first(),
        finalize(() => toastRef.close())
      )
      .subscribe({
        next: (data: any) => {
          this.objLocal = data;
          this.socketChat();
          this.toast.success("Login successfully", {
            duration: 3000,
            position: "top-center",
          });

          this.checkShowChat = true;
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

  logout(): void {
    localStorage.removeItem(GlobalComponent.CARD_LOCAL_STORAGE);
    localStorage.removeItem(GlobalComponent.DISCOUNT_LOCAL_STORAGE);
    localStorage.removeItem(GlobalComponent.PERCENT_LOCAL_STORAGE);
    this.checkShowChat = false;
    this.checkShowChatPop = false;
    this.authService.logout();
    this.objLocal = undefined!;
  }

  navigateForgotPassReset(): void {
    this.modalService.dismissAll();
    this.router.navigate(["/auth/pass-reset"]);
  }

  checkNotRoleAdmin(): boolean {
    return this.objLocal?.role !== RoleSpa.ROLE_ADMIN;
  }

  checkIsRoleUser(): boolean {
    return this.objLocal?.role === RoleSpa.ROLE_USER;
  }

  openEndProfile(content: TemplateRef<any>): void {
    this.offcanvasService.open(content, { position: "end" });
    this.getProfile();
  }

  openEndPass(content: TemplateRef<any>): void {
    this.offcanvasService.open(content, { position: "end" });
  }

  getProfile(): void {
    this.isProfile = false;
    this.authService
      .getProfile()
      .pipe(finalize(() => (this.isProfile = true)))
      .subscribe({
        next: (res) => {
          this.profileData = res.staff;
          this.editDataGet(this.profileData);
          this.socketBooking();
        },
      });
  }

  editDataGet(item: any): void {
    this.submitted = false;
    this.profileForm.controls["fullname"].setValue(item.fullname);
    this.profileForm.controls["email"].setValue(item.email);
    this.profileForm.controls["phone"].setValue(item.phone);
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

  /**
   * Static modal
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

  savePass(): void {
    this.submittedPass = true;

    if (this.passwordForm.invalid) {
      return;
    }

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

  onOtpChange(code: any): void {
    this.code = code;
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

  confirmCode(): void {
    const toastRef = this.toast.loading(`Loading...`, {
      dismissible: true,
      duration: 5000,
      position: "top-center",
    });

    const objCode = {
      code: this.code.toString(),
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

  /**
   * @param smallDataModal
   */
  fullModal(smallDataModal: any): void {
    if (!this.profileData.phone) {
      this.toast.info(
        "Please update your phone number so we can better assist you",
        {
          duration: 6000,
          position: "top-center",
        }
      );

      this.offcanvasService.open(this.profileModel, { position: "end" });

      return;
    }

    if (this.objLocal) {
      this.getBranch();
      this.getListServices();
      this.modalService.open(smallDataModal, {
        size: "fullscreen",
        windowClass: "modal-holder",
      });
    } else {
      this.toast.info(
        "Please log in to book a service. If you don't have an account, please register.",
        {
          duration: 5000,
          position: "top-center",
        }
      );
    }
  }

  getBranch(): void {
    this.branchesService.getAllBranches(FilterAll).subscribe({
      next: (data: any) => {
        this.branches = data.body.users;
      },
    });
  }

  getListServices(): void {
    this.serviceService.getAllServices(FilterAll).subscribe({
      next: (data: any) => {
        this.listService = Object.assign([], data.users);
      },
    });
  }

  generateHours(dayAdd: number): void {
    const hours = [];
    this.selectedDate = new Date();
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const day = this.selectedDate.getDate();

    this.selectedDate = new Date(year, month, day + dayAdd);

    const startHour = new Date(year, month, day + dayAdd, 7, 0);
    const endHour = new Date(year, month, day + dayAdd, 23, 0);

    while (startHour <= endHour) {
      const hour = startHour.getHours().toString().padStart(2, "0");
      const minute = startHour.getMinutes().toString().padStart(2, "0");
      const time = `${hour}:${minute}`;
      hours.push(time);
      startHour.setMinutes(startHour.getMinutes() + 20);
    }

    this.hours = [...hours];
  }

  isPast(hour: string): boolean {
    const hourDate = new Date(`${this.selectedDate.toDateString()} ${hour}`);
    return hourDate.getTime() < this.getCurrentTime().getTime();
  }

  onDateChange(day: number): void {
    this.hours = [];
    this.generateHours(day);
  }

  getCurrentTime(): Date {
    return new Date();
  }

  showDate(dayOffset: number): string {
    const today = new Date();
    today.setDate(today.getDate() + dayOffset);
    const dayOfWeek = today.getDay();
    const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    return `${daysOfWeek[dayOfWeek]}(${today.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })})`;
  }

  getDataChooseBranch(data: BranchModel): void {
    this.branchBooking = data;
  }

  getServiceBooking(data: any): void {
    const index = this.serviceBooking.findIndex(
      (item) => item._id === data._id
    );
    if (index !== -1) {
      this.serviceBooking.splice(index, 1);
    } else {
      this.serviceBooking.push(data);
    }
  }

  getTimeBooking(time: string): void {
    this.timeBooking = new Date(
      `${this.selectedDate.toDateString()} ${time}`
    ).toISOString();

    const dateString = new Date(
      `${this.selectedDate.toDateString()} ${time}`
    ).toLocaleDateString("en-US");
    const timeString = new Date(
      `${this.selectedDate.toDateString()} ${time}`
    ).toLocaleTimeString("en-US");

    this.timeBookingLine = `${dateString} ${timeString}`;
  }

  isServiceBooking(data: ServicesModel[]): boolean {
    return data.length === 0;
  }

  dismissModal(): void {
    this.timeBookingLine = "";
    this.serviceBooking = [];
    this.branchBooking = undefined!;
  }

  bookingForUser(): void {
    const toastRef = this.toast.loading(`Loading...`, {
      dismissible: true,
      duration: 5000,
      position: "top-center",
    });

    const objBooking: any = {
      name: this.profileData?.fullname,
      phone: this.profileData?.phone,
      quantity: 1,
      time: this.timeBooking,
      branch: this.branchBooking._id,
      services: this.serviceBooking.map((service) => service._id),
    };
    this.showSuccess = true;

    this.bookingService
      .addBooking(objBooking)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: () => {
          this.showSuccess = true;
          this.toast.success("Booking successfully", {
            duration: 3000,
            position: "top-center",
          });

          const objNotification = {
            room: GlobalComponent.SOCKET_ROOM_ID,
            data: {
              idUser: this.profileData?._id,
              branch: this.branchBooking?._id,
              type: TypeNotify.BOOKING,
              content: "A new booking has been created.",
            },
            isDuplicate: false,
          };

          this.socket.emit("join", GlobalComponent.SOCKET_ROOM_ID);
          this.socket.emit("messages", objNotification);
          this.socket.emit("join", this.branchBooking._id);
          this.socket.emit("messages", {
            ...objNotification,
            isDuplicate: true,
          });
          this.socket.emit("join", this.profileData._id);
        },
        error: (error) => {
          this.showSuccess = false;
          this.toast.error(error, {
            duration: 3000,
            position: "top-center",
          });
        },
      });
  }

  /**
   * @param bookingModal
   */
  getBooking(bookingModal: any): void {
    this.getMyBooking();
    this.modalService.open(bookingModal, {
      size: "md",
      centered: true,
      scrollable: true,
    });
  }

  getMyBooking(): void {
    this.bookingService.getMyBooking(FilterAll).subscribe({
      next: (res: any) => {
        this.bookingUserData = res.bookings;
      },
    });
  }

  /**
   * @param billModal
   */
  getBill(billModal: any): void {
    this.getMyBill();
    this.modalService.open(billModal, {
      size: "md",
      centered: true,
      scrollable: true,
    });
  }

  getMyBill(): void {
    this.billService.getAllMyBill(FilterAll).subscribe({
      next: (res: any) => {
        this.billUserData = res.users;
      },
    });
  }

  checkClassStatus(status?: string): string {
    switch (status) {
      case BookingStatus.Activated:
        return ColorClass.primary;
      case BookingStatus.Completed:
        return ColorClass.success;
      case BookingStatus.Cancelled:
        return ColorClass.danger;
      case StatusBill.PAID:
        return ColorClass.success;
      case StatusBill.FAILED:
        return ColorClass.danger;
      case StatusBill.PENDING:
        return ColorClass.warning;
      default:
        return ColorClass.warning;
    }
  }

  isPastBooking(time: string): boolean {
    const currentTime = new Date().getTime();
    const targetTime = new Date(time).getTime();

    if (targetTime < currentTime) {
      return false;
    } else {
      return true;
    }
  }

  cancelMyBooking(id: string): void {
    const toastRef = this.toast.loading(`Loading...`, {
      dismissible: true,
      duration: 5000,
      position: "top-center",
    });

    this.bookingService
      .cancelMyBooking(id)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: (res: any) => {
          this.toast.success(res.message, {
            duration: 3000,
            position: "top-center",
          });
        },
        error: (error) => {
          this.toast.error(error.message, {
            duration: 3000,
            position: "top-center",
          });
        },
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getNotiScroll();
    }, 2000);
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

    const getAllNotiFn = this.notificationService.getAllNotificationbyUser.bind(
      this.notificationService
    );

    const notification$ = getAllNotiFn(undefined, objQuery).pipe(
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

  socketBooking(): void {
    this.socket = io(GlobalComponent.SOCKET_ENDPOINT, {
      auth: {
        token: localStorage.getItem(GlobalComponent.TOKEN_KEY),
      },
    });

    this.socket.emit("join", this.profileData?._id);

    this.socket.on("thread", () => {
      document.querySelector(".bx-bell")?.classList.add("bx-tada");
      document.querySelector(".bx-bell")?.classList.add("red");
      setTimeout(() => {
        document.querySelector(".bx-bell")?.classList.remove("bx-tada");
        document.querySelector(".bx-bell")?.classList.remove("red");
      }, 15000);
    });
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
