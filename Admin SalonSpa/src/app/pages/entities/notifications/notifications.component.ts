import { DecimalPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  catchError,
  finalize,
  from,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
} from "@angular/forms";
import { io } from "socket.io-client";
import { NotificationService } from "./notifications.service";
import { FilterAll, GlobalComponent, TypeNotify } from "src/app/app.constant";
import { ContactsService } from "../users/contacts/contacts.service";
import { HotToastService } from "@ngneat/hot-toast";
import { ContactModel } from "../users/contacts/contacts.model";
import { NotificationModel } from "./notifications.model";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
  providers: [NotificationService, DecimalPipe],
})
export class NotificationComponent implements OnInit {
  breadCrumbItems = [
    { label: "Notifications" },
    { label: "List", active: true },
  ];
  notificationDetail!: NotificationModel;
  listNotification: NotificationModel[] = [];
  notiForm!: UntypedFormGroup;
  initalValues!: NotificationModel;
  pagesize = GlobalComponent.ITEMS_PER_PAGE;
  users: ContactModel[] = [];
  total = 0;
  page = 1;
  prevPage = 1;
  deleteId?: string;
  searchUser!: string;
  prevUser!: string;
  checkCreatUser!: boolean;
  submitted = false;
  checkSkeleton = false;
  socket: any;

  constructor(
    private notificationService: NotificationService,
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private toast: HotToastService,
    private contactsService: ContactsService
  ) {}

  ngOnInit(): void {
    this.notiForm = this.formBuilder.group({
      id: [""],
      content: ["", [Validators.required]],
      idUser: ["", [Validators.required]],
    });

    this.loadAllUser();
  }

  loadListNotification(page: number): void {
    const pageToLoad: number = page || this.page || 1;
    const objQuery = { page: pageToLoad };
    this.checkSkeleton = false;

    const notification$ = !this.searchUser
      ? this.notificationService.getAllNotificationForAdmin(objQuery)
      : this.notificationService.getAllNotificationbyUser(
          this.searchUser,
          objQuery
        );

    from(notification$)
      .pipe(
        map((data: any) => {
          this.listNotification = [...data.notifications];
          this.notificationDetail = this.listNotification[0];
          this.page = page!;
          this.total = data.count;
          return true;
        }),
        finalize(() => {
          this.checkSkeleton = true;
        }),
        catchError(() => {
          this.checkSkeleton = false;
          return of(false);
        })
      )
      .subscribe();
  }

  loadAllUser(): void {
    this.contactsService
      .getAllUser(FilterAll)
      .pipe(
        tap((data: any) => {
          this.users = data.body.users;
          this.loadListNotification(this.page);
        }),
        catchError(() => {
          return of();
        })
      )
      .subscribe();
  }

  createNotification(): void {
    if (!this.notiForm.valid) {
      this.submitted = true;
      return;
    }

    this.socket = io(GlobalComponent.SOCKET_ENDPOINT, {
      auth: {
        token: localStorage.getItem(GlobalComponent.TOKEN_KEY),
      },
    });

    const content = this.notiForm.get("content")?.value;

    if (!this.checkCreatUser) {
      for (const user of this.users) {
        const objNotification = {
          room: GlobalComponent.SOCKET_ROOM_ID,
          data: {
            idUser: user?._id,
            type: TypeNotify.USER,
            content,
          },
          isDuplicate: false,
        };
        this.socket.emit("join", user._id);
        this.socket.emit("messages", objNotification);
      }
    } else {
      const idUser = this.notiForm.get("idUser")?.value;
      const objNotification = {
        room: GlobalComponent.SOCKET_ROOM_ID,
        data: {
          idUser,
          type: TypeNotify.USER,
          content,
        },
        isDuplicate: false,
      };

      this.socket.emit("join", idUser);
      this.socket.emit("messages", objNotification);
    }

    this.toast.success("Notification has been sent to the user", {
      duration: 3000,
      position: "top-center",
    });

    this.submitted = true;
    this.loadListNotification(this.page);

    this.modalService.dismissAll();
  }

  deleteNotification(id?: string): void {
    const toastRef = this.toast.loading("Loading...", {
      duration: 5000,
      position: "top-center",
    });

    this.notificationService
      .deleteNotification(id)
      .pipe(finalize(() => toastRef.close()))
      .subscribe({
        next: () => {
          this.toast.success("Delete notification successfully", {
            duration: 3000,
            position: "top-center",
          });

          this.loadListNotification(this.page);
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-center",
          });
        },
      });
  }

  loadPageClick(): void {
    const paginationElement = document.querySelector("ngb-pagination");
    const currentPageElement = paginationElement!.querySelector(
      ".page-item.active .page-link"
    );

    const currentPageNumber = parseInt(
      currentPageElement?.textContent! || "1",
      10
    );

    if (currentPageNumber === this.prevPage) {
      return;
    }

    this.prevPage = Number(currentPageNumber);
    this.loadListNotification(currentPageNumber);
  }

  viewmore(id: number): void {
    this.notificationDetail = this.listNotification[id];
  }

  /**
   * @param content
   */
  openModal(content: any, check: boolean): void {
    const validators = check ? [Validators.required] : null;
    of(null)
      .pipe(
        tap(() => {
          this.notiForm.get("idUser")!.setValidators(validators);
          this.notiForm.get("idUser")!.updateValueAndValidity();
        })
      )
      .subscribe();

    this.submitted = false;
    this.notiForm.reset();
    this.checkCreatUser = check;
    this.modalService.open(content, {
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  get form() {
    return this.notiForm.controls;
  }

  checkEnableSave(): boolean {
    return (
      JSON.stringify(this.notiForm.value) === JSON.stringify(this.initalValues)
    );
  }

  confirm(content: any, id: string): void {
    this.deleteId = id;
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  searchNotify(): void {
    this.page = 1;
    this.loadListNotification(this.page);
    this.prevUser = this.searchUser;
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
