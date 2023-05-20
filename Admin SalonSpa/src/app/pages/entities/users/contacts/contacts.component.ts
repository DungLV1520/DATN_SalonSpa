import { Component, OnDestroy, OnInit } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HotToastService } from "@ngneat/hot-toast";
import { catchError, debounceTime, finalize, takeUntil } from "rxjs/operators";
import { Subject, of } from "rxjs";
import { ngxCsv } from "ngx-csv/ngx-csv";
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {
  ColorClass,
  Filter,
  Gender,
  GlobalComponent,
  RoleSpa,
  UserStatus,
} from "src/app/app.constant";
import { ContactsService } from "./contacts.service";
import { Column, ContactModel } from "./contacts.model";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-contacts",
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.scss"],
  providers: [ContactsService, DecimalPipe],
})
export class ContactsComponent implements OnInit, OnDestroy {
  breadCrumbItems = [{ label: "Users" }, { label: "Customers", active: true }];
  pagesize = GlobalComponent.ITEMS_PER_PAGE;
  selectGender = Object.values(Gender);
  selectRole = Object.values(RoleSpa);
  titleColumn = Object.values(Column);
  statusUser = Object.values(UserStatus);
  checkedVal: ContactModel[] = [];
  initalValues!: ContactModel;
  userDetail?: ContactModel;
  userDetailFirst?: ContactModel;
  users: ContactModel[] = [];
  contactsForm!: UntypedFormGroup;
  searchForm!: FormGroup;
  submitted = false;
  checkSkeleton = false;
  masterSelected!: boolean;
  total = 0;
  page = 1;
  prevPage = 1;
  totalMale!: number;
  totalFemale!: number;
  totalAccount!: number;
  totalActivated!: number;
  totalDeactivated!: number;
  totalPendingVerify!: number;
  checkedValGet: any[] = [];
  deleteId!: string;
  startDate!: string;
  endDate!: string;
  selectedDate!: string;
  private destroySubject = new Subject();

  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private contactsService: ContactsService,
    private db: AngularFirestore,
    private toast: HotToastService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.contactsForm = this.formBuilder.group({
      ids: [""],
      status: [""],
      role: [""],
      fullname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      gender: ["", [Validators.required]],
      phone: ["", [Validators.required]],
    });

    this.searchForm = this.formBuilder.group({
      searchTerm: [""],
    });

    this.onSearch();
    this.loadAllUser(this.page);
    this.getTotalAccount();
  }

  loadAllUser(
    page?: number,
    search?: string,
    start?: string,
    end?: string
  ): void {
    const pageToLoad: number = page || this.page || 1;
    const objQuery: Filter = {
      page: pageToLoad,
    };

    search ? (objQuery["search"] = search) : "";
    start ? (objQuery["start"] = start) : "";
    end ? (objQuery["end"] = end) : "";

    this.checkSkeleton = false;
    this.contactsService
      .getAllUser(objQuery)
      .pipe(
        catchError((error) => {
          this.checkSkeleton = false;
          return of(error);
        })
      )
      .subscribe((data: any) => {
        this.users = data.body.users;
        this.userDetailFirst = this.users[0];
        this.page = page!;
        this.total = data.body.count;
        this.checkSkeleton = true;
      });
  }

  onSearch(): void {
    this.searchForm
      .get("searchTerm")!
      .valueChanges.pipe(debounceTime(500), takeUntil(this.destroySubject))
      .subscribe((searchTerm) => {
        this.prevPage = 1;
        this.loadAllUser(
          this.prevPage,
          searchTerm,
          this.startDate,
          this.endDate
        );
      });
  }

  getTotalAccount(): void {
    this.checkSkeleton = false;
    this.contactsService
      .getAllUser()
      .pipe(
        catchError(() => {
          return of(undefined);
        })
      )
      .subscribe((data: any) => {
        this.totalAccount = data.body.count;
        this.totalMale = this.countUsersByGender(Gender.Male);
        this.totalFemale = this.countUsersByGender(Gender.Female);
        this.totalActivated = this.countUsersByStatus(UserStatus.Activated);
        this.totalDeactivated = this.countUsersByStatus(UserStatus.Deactivated);
        this.totalPendingVerify = this.countUsersByStatus(
          UserStatus.PendingVerify
        );
      });
  }

  countUsersByGender(gender: Gender): number {
    return this.users.filter(
      (user: ContactModel) => user.gender.toLowerCase() === gender
    ).length;
  }

  countUsersByStatus(status: UserStatus): number {
    return this.users.filter((user: ContactModel) => user.status === status)
      .length;
  }

  emitUserDetail(data: ContactModel): void {
    this.userDetail = data;
  }

  saveUser(): void {
    if (this.contactsForm.valid) {
      if (this.contactsForm.get("ids")?.value) {
        const toastRef = this.toast.loading("Loading...", {
          duration: 5000,
          position: "top-center",
        });

        this.contactsService
          .updateUser(
            this.contactsForm.get("ids")?.value,
            this.contactsForm.value
          )
          .pipe(
            catchError((error) => {
              this.toast.error(error, {
                duration: 3000,
                position: "top-center",
              });

              return of(undefined);
            }),
            finalize(() => toastRef.close())
          )
          .subscribe({
            next: () => {
              this.modalService.dismissAll();
              this.loadAllUser(
                this.page,
                this.searchForm.get("searchTerm")!.value,
                this.startDate,
                this.endDate
              );
              this.getTotalAccount();
              this.toast.success("Contact updated successfully", {
                duration: 3000,
                position: "top-center",
              });
            },
          });
      }
    }

    this.submitted = true;
  }

  /**
   * @param content
   */
  editDataGet(item: any, content: any): void {
    this.submitted = false;
    this.modalService.open(content, {
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });

    const modelTitle = document.querySelector(
      ".modal-title"
    ) as HTMLAreaElement;
    modelTitle.innerHTML = "Edit Contact";
    const updateBtn = document.getElementById("add-btn") as HTMLAreaElement;
    updateBtn.innerHTML = "Update";

    this.contactsForm.controls["fullname"].setValue(item.fullname);
    this.contactsForm.controls["email"].setValue(item.email);
    this.contactsForm.controls["phone"].setValue(item.phone);
    this.contactsForm.controls["role"].setValue(item.role);
    this.contactsForm.controls["status"].setValue(item.status);
    this.contactsForm.controls["gender"].setValue(item.gender);
    this.contactsForm.controls["ids"].setValue(item._id);

    this.initalValues = this.contactsForm.value;
  }

  checkUncheckAll(ev: any): void {
    this.users.forEach(
      (x: { state: boolean }) => (x.state = ev.target.checked)
    );

    const checkedVal = this.users.filter(
      (x: { state: boolean }) => x.state === true
    );

    this.checkedValGet = checkedVal;

    (document.getElementById("remove-actions") as HTMLElement).style.display =
      this.checkedValGet.length > 0 ? "block" : "none";
  }

  onCheckboxChange(ev: any, data: ContactModel): void {
    if (ev.target.checked === true) {
      data["state"] = ev.target.checked;
      this.checkedVal.push(data);
    }

    this.checkedVal = this.checkedVal.filter((obj, index, self) => {
      return (
        index === self.findIndex((t) => t._id === obj._id) && obj.state === true
      );
    });

    this.checkedValGet = this.checkedVal;

    (document.getElementById("remove-actions") as HTMLElement).style.display =
      this.checkedVal.length > 0 ? "block" : "none";
  }

  deleteData(id?: string): void {
    if (id) {
      const toastRef = this.toast.loading("Loading...", {
        duration: 5000,
        position: "top-center",
      });

      this.contactsService
        .deleteUser(id)
        .pipe(
          catchError((error) => {
            this.toast.error(error, {
              duration: 3000,
              position: "top-center",
            });

            return of(undefined);
          }),
          finalize(() => toastRef.close())
        )
        .subscribe({
          next: () => {
            this.loadAllUser(
              this.page,
              this.searchForm.get("searchTerm")!.value,
              this.startDate,
              this.endDate
            );
            this.getTotalAccount();
            this.db.doc(`chat/${id}`).delete();
            this.db.doc(`tracking-chat/${id}`).delete();

            this.toast.success("Contact deleted successfully", {
              duration: 3000,
              position: "top-center",
            });
          },
        });

      document.getElementById("c_" + id)?.remove();
    } else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById("c_" + item)?.remove();
      });

      this.toast.success("Contact deleted successfully", {
        duration: 3000,
        position: "top-center",
      });
    }
  }

  deleteMultiple(content: any): void {
    const checkboxes: any = document.getElementsByName("checkAll");
    let result;
    const checkedVal: any[] = [];

    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }

    if (checkedVal.length > 0) {
      this.modalService.open(content, {
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
    } else {
      this.toast.info("Please select at least one checkbox", {
        duration: 3000,
        position: "top-center",
      });
    }

    this.checkedValGet = checkedVal;
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
    this.loadAllUser(
      currentPageNumber,
      this.searchForm.get("searchTerm")!.value,
      this.startDate,
      this.endDate
    );
  }

  get form() {
    return this.contactsForm.controls;
  }

  csvFileExport(): void {
    var orders = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
      showTitle: true,
      title: "Contact Data",
      useBom: true,
      noDownload: false,
      headers: this.titleColumn,
    };

    new ngxCsv(this.users, "Contact", orders);
  }

  confirm(content: any, id: string) {
    this.deleteId = id;
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  checkEnableSave(): boolean {
    return (
      JSON.stringify(this.contactsForm.value) ===
      JSON.stringify(this.initalValues)
    );
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

  checkClassRole(role?: string): string {
    switch (role?.toLowerCase()) {
      case RoleSpa.ROLE_ADMIN:
        return ColorClass.danger;
      case RoleSpa.ROLE_USER:
        return ColorClass.primary;
      case RoleSpa.ROLE_MANAGER:
        return ColorClass.success;
      default:
        return ColorClass.warning;
    }
  }

  checkClassStatus(status?: string): string {
    switch (status) {
      case UserStatus.Activated:
        return ColorClass.success;
      case UserStatus.Deactivated:
        return ColorClass.danger;
      case UserStatus.PendingVerify:
        return ColorClass.warning;
      default:
        return ColorClass.warning;
    }
  }

  onChangeTime(e: any): void {
    const [start, end] = e.target.value.split(" to ");
    this.startDate = start;
    this.endDate = end;
    if (start && end) {
      this.loadAllUser(1, this.searchForm.get("searchTerm")!.value, start, end);
    } else if (!start && !end) {
      this.loadAllUser(1, this.searchForm.get("searchTerm")!.value);
    }
  }

  clearFilter(): void {
    this.startDate = this.endDate = this.selectedDate = "";
    this.searchForm.reset();
  }

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }
}
