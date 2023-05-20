import { Component } from "@angular/core";
import { DecimalPipe } from "@angular/common";
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
import { EmployeesService } from "./employees.service";
import { BranchesService } from "../../branches/branches.service";
import {
  ColorClass,
  Filter,
  FilterAll,
  Gender,
  GlobalComponent,
  RoleSpa,
  UserStatus,
} from "src/app/app.constant";
import { EmployeeModel } from "./employees.model";
import { BranchModel } from "../../branches/branches.model";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-employees",
  templateUrl: "./employees.component.html",
  styleUrls: ["./employees.component.scss"],
  providers: [EmployeesService, DecimalPipe],
})
export class EmployeesComponent {
  breadCrumbItems = [{ label: "Users" }, { label: "Employees", active: true }];
  selectGender = Object.values(Gender);
  statusUser = Object.values(UserStatus);
  pagesize = GlobalComponent.ITEMS_PER_PAGE;
  employeesForm!: UntypedFormGroup;
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
  initalValues!: EmployeeModel;
  employees: EmployeeModel[] = [];
  branchesData: BranchModel[] = [];
  checkedValGet: any[] = [];
  checkedVal: any[] = [];
  private destroySubject = new Subject();
  startDate!: string;
  endDate!: string;
  selectedDate!: string;
  RoleSpa = RoleSpa;
  userDataLocal: any;

  constructor(
    private modalService: NgbModal,
    private employeesService: EmployeesService,
    private formBuilder: UntypedFormBuilder,
    private branchesService: BranchesService,
    private toast: HotToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.employeesForm = this.formBuilder.group({
      ids: [""],
      fullname: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      age: ["", [Validators.required]],
      job: ["", [Validators.required]],
      branch: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      status: ["", [Validators.required]],
    });

    this.searchForm = this.formBuilder.group({
      searchTerm: [""],
    });

    this.userDataLocal = JSON.parse(
      localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
    );

    this.onSearch();
    this.loadAllBranches();

    if (this.userDataLocal?.role === RoleSpa.ROLE_MANAGER) {
      this.getProfile();
    } else {
      this.loadAllEmployees(this.page);
    }
  }

  getProfile(): void {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.searchBranch = res?.staff?.branch?._id;
        this.getEmployeeFromBranch(1);
      },
    });
  }

  loadAllEmployees(
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
    this.employeesService
      .getAllEmployees(objQuery)
      .pipe(
        catchError(() => of(null)),
        finalize(() => (this.checkSkeleton = true))
      )
      .subscribe((data: any) => {
        this.employees = data?.body?.users;
        this.page = page!;
        this.total = data?.body?.count;
      });
  }

  onSearch(): void {
    this.searchForm
      .get("searchTerm")!
      .valueChanges.pipe(debounceTime(500), takeUntil(this.destroySubject))
      .subscribe((searchTerm) => {
        this.prevPage = 1;
        if (this.searchBranch) {
          this.getEmployeeFromBranch(
            this.prevPage,
            searchTerm,
            this.startDate,
            this.endDate
          );
        } else {
          this.loadAllEmployees(
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
      this.getEmployeeFromBranch(
        currentPageNumber,
        this.searchForm.get("searchTerm")!.value,
        this.startDate,
        this.endDate
      );
    } else {
      this.loadAllEmployees(
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
      this.getEmployeeFromBranch(
        1,
        this.searchForm.get("searchTerm")!.value,
        this.startDate,
        this.endDate
      );
      this.prevPage = 1;
    } else {
      this.loadAllEmployees(
        1,
        this.searchForm.get("searchTerm")!.value,
        this.startDate,
        this.endDate
      );
    }
  }

  getEmployeeFromBranch(
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
    this.employeesService
      .getEmployeeFromBranch(this.searchBranch, objQuery)
      .pipe()
      .subscribe({
        next: (data: any) => {
          this.employees = data.body.users;
          this.page = page!;
          this.total = data.body.count;
          this.checkSkeleton = true;
        },
        error: (error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-center",
          });
        },
      });
  }

  saveEmployee(): void {
    if (this.employeesForm.valid) {
      const id = this.employeesForm.get("ids")?.value;
      const employeeData = this.employeesForm.value;

      const request$ = id
        ? this.employeesService.updateEmployee(id, employeeData)
        : this.employeesService.addEmployeeToBranch(
            employeeData.branch,
            employeeData
          );

      const toastRef = this.toast.loading("Loading...", {
        duration: 5000,
        position: "top-center",
      });

      request$
        .pipe(
          tap(() => {
            const successMessage = id
              ? "Update employee successfully"
              : "Add employee successfully. Send to email and pass to employee ";

            this.toast.success(successMessage, {
              duration: 3000,
              position: "top-center",
            });

            this.modalService.dismissAll();
            this.loadAllEmployees(
              this.page,
              this.searchForm.get("searchTerm")!.value,
              this.startDate,
              this.endDate
            );

            this.employeesForm.reset();
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
    modelTitle.innerHTML = "Edit Employee";
    const updateBtn = document.getElementById("add-btn") as HTMLAreaElement;
    updateBtn.innerHTML = "Update";

    this.employeesForm.controls["fullname"].setValue(item.user.fullname);
    this.employeesForm.controls["gender"].setValue(item.user.gender);
    this.employeesForm.controls["job"].setValue(item.job);
    this.employeesForm.controls["age"].setValue(item.age);
    this.employeesForm.controls["branch"].setValue(item.branch._id);
    this.employeesForm.controls["ids"].setValue(item._id);
    this.employeesForm.controls["email"].setValue(item.user.email);
    this.employeesForm.controls["phone"].setValue(item.user.phone);
    this.employeesForm.controls["status"].setValue(item.user.status);

    this.initalValues = this.employeesForm.value;
  }

  /**
   * @param content
   */
  openModal(content: any): void {
    this.submitted = false;
    this.employeesForm.reset();
    this.modalService.open(content, {
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  deleteEmployee(id: string): void {
    if (id) {
      const toastRef = this.toast.loading("Loading...", {
        duration: 5000,
        position: "top-center",
      });

      this.employeesService
        .deleteEmployee(id)
        .pipe(
          tap(() => {
            this.loadAllEmployees(
              this.page,
              this.searchForm.get("searchTerm")!.value,
              this.startDate,
              this.endDate
            );

            this.toast.success("Delete employee successfully", {
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

      this.toast.success("Delete employee successfully", {
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
    this.employees.forEach(
      (x: { state: boolean }) => (x.state = ev.target.checked)
    );

    const checkedVal = this.employees.filter(
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
    return this.employeesForm.controls;
  }

  checkEnableSave(): boolean {
    return (
      JSON.stringify(this.employeesForm.value) ===
      JSON.stringify(this.initalValues)
    );
  }

  confirm(content: any, id: any) {
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
        this.getEmployeeFromBranch(
          1,
          this.searchForm.get("searchTerm")!.value,
          start,
          end
        );
      } else {
        this.loadAllEmployees(
          1,
          this.searchForm.get("searchTerm")!.value,
          start,
          end
        );
      }
    } else if (!start && !end) {
      if (this.searchBranch) {
        this.getEmployeeFromBranch(1, this.searchForm.get("searchTerm")!.value);
      } else {
        this.loadAllEmployees(1, this.searchForm.get("searchTerm")!.value);
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
