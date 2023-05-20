import { Component } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { NgbModal, NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
} from "@angular/forms";
import * as moment from "moment";
import { Socket, io } from "socket.io-client";
import { HotToastService } from "@ngneat/hot-toast";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import { BookingService } from "./bookings.service";
import {
  ColorClass,
  Filter,
  Gender,
  GlobalComponent,
  RoleSpa,
} from "../../../app.constant";
import { BookingModel, BookingStatus } from "./bookings.model";
import { Subject, debounceTime, finalize, takeUntil } from "rxjs";
import { ServicesModel } from "../../entities/services/services.model";
import { MarketModel } from "../market/market.model";
import { MarketService } from "../market/market.service";
import { BillService } from "../bill-admin/bills.service";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-bookings",
  templateUrl: "./bookings.component.html",
  styleUrls: ["./bookings.component.scss"],
  providers: [BookingService, DecimalPipe],
})
export class BookingComponent {
  breadCrumbItems = [{ label: "Bookings" }, { label: "List", active: true }];
  selectGender = Object.values(Gender);
  pagesize = GlobalComponent.ITEMS_PER_PAGE;
  bookingForm!: UntypedFormGroup;
  searchForm!: FormGroup;
  bookingId: string | undefined;
  masterSelected!: boolean;
  submitted = false;
  total = 0;
  page = 1;
  prevPage = 1;
  status!: string;
  checkedVal: any[] = [];
  checkedValGet: any[] = [];
  booking: BookingModel[] = [];
  socket!: Socket<DefaultEventsMap>;
  startDate!: string;
  endDate!: string;
  selectedDate!: string;
  arrayCard: MarketModel[] = [];
  totalActive!: number;
  checkSkeleton = false;
  totalCompleted!: number;
  totalCancelled!: number;
  totalStatus = 0;
  private destroySubject = new Subject();
  profileData: any;

  constructor(
    private modalService: NgbModal,
    private bookingService: BookingService,
    private formBuilder: UntypedFormBuilder,
    private toast: HotToastService,
    private marketService: MarketService,
    private billService: BillService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      searchTerm: [""],
    });

    this.onSearch();
    this.getAllBooking(this.page);
    this.getProfileAndSocketBooking();
  }

  getAllBooking(
    page?: number,
    status?: string,
    search?: string,
    start?: string,
    end?: string
  ): void {
    const pageToLoad: number = page || this.page || 1;
    const objQuery: Filter = {
      page: pageToLoad,
    };

    status ? (objQuery["status"] = status) : "";
    search ? (objQuery["search"] = search) : "";
    start ? (objQuery["start"] = start) : "";
    end ? (objQuery["end"] = end) : "";
    this.status = status!;
    this.checkSkeleton = false;
    this.bookingService
      .getAllBooking(objQuery)
      .pipe(finalize(() => (this.checkSkeleton = true)))
      .subscribe({
        next: (data: any) => {
          this.booking = data.users;
          this.page = page!;
          this.total = data.count;

          const bookingStatuses = data?.totalStatus;
          this.totalStatus = data.totalAllStatus;
          if (!bookingStatuses) return;

          this.totalActive = bookingStatuses[BookingStatus.Activated];
          this.totalCompleted = bookingStatuses[BookingStatus.Completed];
          this.totalCancelled = bookingStatuses[BookingStatus.Cancelled];
        },
        error: () => {},
      });
  }

  onSearch(): void {
    this.searchForm
      .get("searchTerm")!
      .valueChanges.pipe(debounceTime(500), takeUntil(this.destroySubject))
      .subscribe((searchTerm) => {
        this.prevPage = 1;
        this.getAllBooking(
          this.prevPage,
          this.status,
          searchTerm,
          this.startDate,
          this.endDate
        );
      });
  }

  loadPageClick(): void {
    const paginationElement = document.querySelector("ngb-pagination");
    const currentPageElement = paginationElement!.querySelector(
      ".page-item.active .page-link"
    );
    const currentPageNumber = parseInt(currentPageElement?.textContent!, 10);

    if (currentPageNumber === this.prevPage) {
      return;
    }

    this.prevPage = Number(currentPageNumber);
    this.getAllBooking(
      currentPageNumber,
      this.status,
      this.searchForm.get("searchTerm")!.value,
      this.startDate,
      this.endDate
    );
  }

  saveUser(): void {
    this.submitted = true;
    if (!this.bookingForm.valid) {
      return;
    }

    const date = moment
      .utc(new Date(this.bookingForm.get("time")?.value))
      .local();
    const formattedDate = date.format("MM-DD-YYYY");
    const hour = this.bookingForm
      .get("hour")
      ?.value.toString()
      .padStart(2, "0");
    const minute = this.bookingForm
      .get("minutes")
      ?.value.toString()
      .padStart(2, "0");

    this.bookingForm.value["time"] = hour + ":" + minute + " " + formattedDate;
    this.bookingForm.value["phone"] =
      this.bookingForm.value["phone"].toString();

    delete this.bookingForm.value["hour"];
    delete this.bookingForm.value["minutes"];
    delete this.bookingForm.value["idUser"];

    const updateBooking = () => {
      const id = this.bookingForm.get("_id")?.value;
      const values = this.bookingForm.value;
      const request = id
        ? this.bookingService.updateBooking(id, values)
        : this.bookingService.addBooking(values);

      request.subscribe({
        next: () => {
          const message = id ? "Update" : "Add";
          this.toast.success(`${message} booking successfully`, {
            duration: 3000,
            position: "top-right",
          });

          this.modalService.dismissAll();

          this.getAllBooking(
            this.page,
            this.status,
            this.searchForm.get("searchTerm")!.value,
            this.startDate,
            this.endDate
          );
          this.bookingForm.reset();
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-right",
          });
        },
      });
    };

    updateBooking();
  }

  /**
   * @param content
   */
  editDataGet(data: any, content: any): void {
    this.submitted = false;
    const date = moment.utc(new Date(data.time)).local();
    const hour = Number(date.format("hh"));
    const minutes = Number(date.format("mm"));

    this.modalService.open(content, {
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    const modelTitle = document.querySelector(
      ".modal-title"
    ) as HTMLAreaElement;
    modelTitle.innerHTML = "Edit Booking";
    const updateBtn = document.getElementById("add-btn") as HTMLAreaElement;
    updateBtn.innerHTML = "Update";

    this.bookingForm.controls["_id"].setValue(data._id);
    this.bookingForm.controls["name"].setValue(data.name);
    this.bookingForm.controls["gender"].setValue(data.gender);
    this.bookingForm.controls["phone"].setValue(data.phone);
    this.bookingForm.controls["time"].setValue(data.time);
    this.bookingForm.controls["idUser"].setValue(data.idUser);
    this.bookingForm.controls["hour"].setValue(hour);
    this.bookingForm.controls["minutes"].setValue(minutes);
  }

  cancelData(): void {
    this.changeStatusBooking("Cancelled", this.bookingId);
  }

  deleteMultiple(content: any): void {
    const checkboxes: any = document.getElementsByName("checkAll");
    this.checkedValGet = Array.from(checkboxes)
      .filter((checkbox: any) => checkbox.checked)
      .map((checkbox: any) => checkbox.value);

    if (this.checkedValGet?.length > 0) {
      this.modalService.open(content, {
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
    } else {
      this.toast.info("Please select at least one checkbox", {
        duration: 3000,
        position: "top-right",
      });
    }
  }

  checkUncheckAll(ev: any): void {
    this.booking.forEach((booking: any) => (booking.state = ev.target.checked));
    this.checkedValGet = this.booking.filter((booking: any) => booking.state);

    (document.getElementById("remove-actions") as HTMLElement).style.display =
      this.checkedValGet.length ?? 0 > 0 ? "block" : "none";
  }

  onCheckboxChange(ev: any, data: any): void {
    if (ev.target.checked === true) {
      data["state"] = ev.target.checked;
      this.checkedVal.push(data);
    }

    this.checkedVal = this.checkedVal.filter((booking, index, self) => {
      return (
        booking.state && index === self.findIndex((t) => t._id === booking._id)
      );
    });

    this.checkedValGet = this.checkedVal;

    (document.getElementById("remove-actions") as HTMLElement).style.display =
      this.checkedVal.length > 0 ? "block" : "none";
  }

  confirm(content: any, id: any): void {
    this.bookingId = id;
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  getProfileAndSocketBooking(): void {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.profileData = res.staff;
        this.socketBooking(this.profileData?.branch?._id);
      },
    });
  }

  socketBooking(branchId: string): void {
    this.socket = io(GlobalComponent.SOCKET_ENDPOINT, {
      auth: {
        token: localStorage.getItem(GlobalComponent.TOKEN_KEY),
      },
    });

    const objLocal = JSON.parse(
      localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
    );

    if (objLocal.role === RoleSpa.ROLE_ADMIN) {
      this.socket.emit("join", GlobalComponent.SOCKET_ROOM_ID);
    } else {
      this.socket.emit("join", branchId);
    }

    this.socket.on("thread", () => {
      this.clearFilter();
      this.getAllBooking(1);
    });
  }

  /**
   * @param content
   */
  openModal(content: any): void {
    this.submitted = false;
    this.bookingForm.reset();
    this.modalService.open(content, {
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  get form() {
    return this.bookingForm.controls;
  }

  onNavChange(changeEvent: NgbNavChangeEvent): void {
    if (changeEvent.nextId === 1) {
      this.getAllBooking(1);
    } else if (changeEvent.nextId === 2) {
      this.getAllBooking(
        1,
        BookingStatus.Activated,
        this.searchForm.get("searchTerm")!.value,
        this.startDate,
        this.endDate
      );
    } else if (changeEvent.nextId === 3) {
      this.getAllBooking(
        1,
        BookingStatus.Completed,
        this.searchForm.get("searchTerm")!.value,
        this.startDate,
        this.endDate
      );
    } else {
      this.getAllBooking(
        1,
        BookingStatus.Cancelled,
        this.searchForm.get("searchTerm")!.value,
        this.startDate,
        this.endDate
      );
    }
  }

  checkClassGender(gender?: string): string {
    switch (gender) {
      case Gender.Male:
        return ColorClass.danger;
      case Gender.Female:
        return ColorClass.success;
      default:
        return ColorClass.warning;
    }
  }

  checkClassStatus(status?: string): string {
    switch (status) {
      case BookingStatus.Activated:
        return ColorClass.primary;
      case BookingStatus.Completed:
        return ColorClass.success;
      case BookingStatus.Cancelled:
        return ColorClass.danger;
      default:
        return ColorClass.warning;
    }
  }

  onChangeTime(e: any): void {
    const [start, end] = e.target.value.split(" to ");
    this.startDate = start;
    this.endDate = end;
    if (start && end) {
      this.getAllBooking(
        1,
        this.status,
        this.searchForm.get("searchTerm")!.value,
        start,
        end
      );
    } else if (!start && !end) {
      this.getAllBooking(
        1,
        this.status,
        this.searchForm.get("searchTerm")!.value
      );
    }
  }

  clearFilter(): void {
    this.startDate = this.endDate = this.selectedDate = "";
    this.searchForm.reset();
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

  paymentServiceForUsers(data: ServicesModel[]): void {
    this.arrayCard = [...data];
    const card = this.covertCaculateCard(this.arrayCard);
    localStorage.setItem("card", JSON.stringify(card));
    this.marketService.setCard(true);

    this.toast.success("Add booking into Card successfully", {
      duration: 3000,
      position: "top-center",
    });
  }

  changeStatusBooking(status?: string, bookingId?: string): void {
    const objStatus = {
      event: status,
      bookingId: bookingId,
    };

    const toastRef = this.toast.loading(`Loading...`, {
      dismissible: true,
      duration: 10000,
      position: "top-center",
    });

    this.billService
      .changeStatusBooking(objStatus)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: (res: any) => {
          this.toast.success(res.message, {
            duration: 3000,
            position: "top-right",
          });

          this.getAllBooking(
            this.prevPage,
            this.status,
            this.searchForm.get("searchTerm")!.value,
            this.startDate,
            this.endDate
          );
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-right",
          });
        },
      });
  }
}
