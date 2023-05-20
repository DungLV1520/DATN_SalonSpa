import { Component } from "@angular/core";
import {
  Subject,
  catchError,
  debounceTime,
  finalize,
  of,
  takeUntil,
  tap,
} from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { HotToastService } from "@ngneat/hot-toast";
import { BranchesService } from "../../branches/branches.service";
import {
  ColorClass,
  Filter,
  FilterAll,
  Gender,
  GlobalComponent,
  UserStatus,
} from "src/app/app.constant";
import { BranchModel } from "../../branches/branches.model";
import { ManagerModel } from "./managers.model";
import { ManagerService } from "./managers.service";

@Component({
  selector: "app-managers",
  templateUrl: "./managers.component.html",
  styleUrls: ["./managers.component.scss"],
})
export class ManagersComponent {
  breadCrumbItems = [{ label: "Users" }, { label: "Managers", active: true }];
  selectGender = Object.values(Gender);
  statusUser = Object.values(UserStatus);
  pagesize = GlobalComponent.ITEMS_PER_PAGE;
  managersForm!: UntypedFormGroup;
  searchForm!: FormGroup;
  masterSelected!: boolean;
  submitted = false;
  total = 0;
  page = 1;
  prevPage = 1;
  deleteId!: string;
  fieldTextType!: boolean;
  searchBranch!: string;
  checkSkeleton = false;
  initalValues!: ManagerModel;
  managers: ManagerModel[] = [];
  branchesData: BranchModel[] = [];
  checkedValGet: any[] = [];
  checkedVal: any[] = [];
  private destroySubject = new Subject();
  startDate!: string;
  endDate!: string;
  selectedDate!: string;

  constructor(
    private modalService: NgbModal,
    private managerService: ManagerService,
    private formBuilder: UntypedFormBuilder,
    private branchesService: BranchesService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.managersForm = this.formBuilder.group({
      ids: [""],
      fullname: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      age: ["", [Validators.required]],
      branch: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      status: ["", [Validators.required]],
    });

    this.searchForm = this.formBuilder.group({
      searchTerm: [""],
    });

    this.onSearch();
    this.loadAllBranches();
    this.loadAllManagers(this.page);
  }

  loadAllManagers(
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

    search ? (objQuery["search"] = search) : "";
    this.checkSkeleton = false;
    this.managerService
      .getAllManagers(objQuery)
      .pipe(
        catchError(() => of(null)),
        finalize(() => (this.checkSkeleton = true))
      )
      .subscribe((data: any) => {
        this.managers = data?.body?.users;
        this.page = page!;
        this.total = data.body.count;
      });
  }

  onSearch(): void {
    this.searchForm
      .get("searchTerm")!
      .valueChanges.pipe(debounceTime(500), takeUntil(this.destroySubject))
      .subscribe((searchTerm) => {
        this.prevPage = 1;
        if (this.searchBranch) {
          this.geManagerFromBranch(
            this.prevPage,
            searchTerm,
            this.startDate,
            this.endDate
          );
        } else {
          this.loadAllManagers(
            this.prevPage,
            searchTerm,
            this.startDate,
            this.endDate
          );
        }
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
    if (this.searchBranch) {
      this.geManagerFromBranch(
        currentPageNumber,
        this.searchForm.get("searchTerm")!.value,
        this.startDate,
        this.endDate
      );
    } else {
      this.loadAllManagers(
        currentPageNumber,
        this.searchForm.get("searchTerm")!.value,
        this.startDate,
        this.endDate
      );
    }
  }

  loadAllBranches(): void {
    this.branchesService
      .getAllBranches(FilterAll)
      .pipe()
      .subscribe({
        next: (data: any) => {
          this.branchesData = data.body.users;
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-center",
          });
        },
      });
  }

  filterBranch(): void {
    if (this.searchBranch) {
      this.geManagerFromBranch(
        1,
        this.searchForm.get("searchTerm")!.value,
        this.startDate,
        this.endDate
      );
      this.prevPage = 1;
    } else {
      this.loadAllManagers(
        1,
        this.searchForm.get("searchTerm")!.value,
        this.startDate,
        this.endDate
      );
    }
  }

  geManagerFromBranch(
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
    this.managerService
      .getManagerFromBranch(this.searchBranch, objQuery)
      .pipe()
      .subscribe({
        next: (data: any) => {
          this.managers = data.body.users;
          this.page = page!;
          this.total = data.body.count;
          setTimeout(() => {
            this.checkSkeleton = true;
          }, 200);
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-center",
          });
        },
      });
  }

  saveManager(): void {
    if (this.managersForm.valid) {
      const id = this.managersForm.get("ids")?.value;
      const managerData = this.managersForm.value;

      const request$ = id
        ? this.managerService.updateManager(id, managerData)
        : this.managerService.addManagerToBranch(
            managerData.branch,
            managerData
          );

      const toastRef = this.toast.loading("Loading...", {
        duration: 5000,
        position: "top-center",
      });

      request$
        .pipe(
          tap(() => {
            const successMessage = id
              ? "Update manager successfully"
              : "Add manager successfully. Send to email and pass to manager ";

            this.toast.success(successMessage, {
              duration: 3000,
              position: "top-center",
            });

            this.modalService.dismissAll();
            this.loadAllManagers(
              this.page,
              this.searchForm.get("searchTerm")!.value,
              this.startDate,
              this.endDate
            );

            this.managersForm.reset();
          }),
          catchError((error) => {
            this.toast.error(error, {
              duration: 3000,
              position: "top-center",
            });
            return of(error);
          }),
          finalize(() => toastRef.close())
        )
        .subscribe();
    }

    this.submitted = true;
  }

  /**
   * @param content
   */
  editDataGet(content?: any, item?: any): void {
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
    modelTitle.innerHTML = "Edit Manager";
    const updateBtn = document.getElementById("add-btn") as HTMLAreaElement;
    updateBtn.innerHTML = "Update";

    this.managersForm.controls["fullname"].setValue(item.user.fullname);
    this.managersForm.controls["gender"].setValue(item.user.gender);
    this.managersForm.controls["age"].setValue(item.age);
    this.managersForm.controls["branch"].setValue(item.branch._id);
    this.managersForm.controls["ids"].setValue(item._id);
    this.managersForm.controls["email"].setValue(item.user.email);
    this.managersForm.controls["phone"].setValue(item.user.phone);
    this.managersForm.controls["status"].setValue(item.user.status);

    this.initalValues = this.managersForm.value;
  }

  /**
   * @param content
   */
  openModal(content: any): void {
    this.submitted = false;
    this.managersForm.reset();
    this.modalService.open(content, {
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  deleteManager(id: string): void {
    if (id) {
      const toastRef = this.toast.loading("Loading...", {
        duration: 5000,
        position: "top-center",
      });

      this.managerService
        .deleteManager(id)
        .pipe(
          tap(() => {
            this.loadAllManagers(
              this.page,
              this.searchForm.get("searchTerm")!.value,
              this.startDate,
              this.endDate
            );

            this.toast.success("Delete manager successfully", {
              duration: 3000,
              position: "top-center",
            });
          }),
          catchError((error) => {
            this.toast.error(error, {
              duration: 3000,
              position: "top-center",
            });
            return of(error);
          }),
          finalize(() => toastRef.close())
        )
        .subscribe();

      document.getElementById("l_" + id)?.remove();
    } else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById("l_" + item)?.remove();
      });

      this.toast.success("Delete manager successfully", {
        duration: 3000,
        position: "top-center",
      });
    }
  }

  deleteMultiple(content: any): void {
    const checkboxes: any = document.getElementsByName("checkAll");
    let result;
    const checkedVal: string[] = [];

    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }

    this.checkedValGet = checkedVal;

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
  }

  checkUncheckAll(ev: any): void {
    this.managers.forEach(
      (x: { state: boolean }) => (x.state = ev.target.checked)
    );

    const checkedVal = this.managers.filter(
      (x: { state: boolean }) => x.state === true
    );

    this.checkedValGet = checkedVal;

    (document.getElementById("remove-actions") as HTMLElement).style.display =
      this.checkedValGet.length ?? 0 > 0 ? "block" : "none";
  }

  onCheckboxChange(ev: any, data: any): void {
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

  get form() {
    return this.managersForm.controls;
  }

  checkEnableSave(): boolean {
    return (
      JSON.stringify(this.managersForm.value) ===
      JSON.stringify(this.initalValues)
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

  toggleFieldTextType(): void {
    this.fieldTextType = !this.fieldTextType;
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

  onChangeTime(e: any): void {
    const [start, end] = e.target.value.split(" to ");
    this.startDate = start;
    this.endDate = end;
    if (start && end) {
      if (this.searchBranch) {
        this.geManagerFromBranch(
          1,
          this.searchForm.get("searchTerm")!.value,
          start,
          end
        );
      } else {
        this.loadAllManagers(
          1,
          this.searchForm.get("searchTerm")!.value,
          start,
          end
        );
      }
    } else if (!start && !end) {
      if (this.searchBranch) {
        this.geManagerFromBranch(1, this.searchForm.get("searchTerm")!.value);
      } else {
        this.loadAllManagers(1, this.searchForm.get("searchTerm")!.value);
      }
    }
  }

  clearFilter(): void {
    this.searchBranch = this.startDate = this.endDate = this.selectedDate = "";
    this.searchForm.reset();
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
}
