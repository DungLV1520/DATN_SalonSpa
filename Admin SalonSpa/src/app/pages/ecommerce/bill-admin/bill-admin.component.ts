import { Component } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { catchError, finalize, of, tap } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { BillService } from "./bills.service";
import { ServicesService } from "../../entities/services/services.service";
import { EmployeesService } from "../../entities/users/employees/employees.service";
import { ContactsService } from "../../entities/users/contacts/contacts.service";
import { ContactModel } from "../../entities/users/contacts/contacts.model";
import { HotToastService } from "@ngneat/hot-toast";
import {
  ColorClass,
  Filter,
  Gender,
  GlobalComponent,
} from "src/app/app.constant";
import { BranchModel } from "../../entities/branches/branches.model";
import { ServicesModel } from "../../entities/services/services.model";
import { EmployeeModel } from "../../entities/users/employees/employees.model";
import { BillModel, StatusBill } from "./bill-admin.model";

@Component({
  selector: "app-bills",
  templateUrl: "./bill-admin.component.html",
  styleUrls: ["./bill-admin.component.scss"],
  providers: [DecimalPipe],
})
export class BillAdminComponent {
  breadCrumbItems = [{ label: "Bills" }, { label: "List", active: true }];
  selectGender = Object.values(Gender);
  pagesize = GlobalComponent.ITEMS_PER_PAGE;
  submitted = false;
  employeesForm!: UntypedFormGroup;
  masterSelected!: boolean;
  listServiceData: ServicesModel[] = [];
  branchesData: BranchModel[] = [];
  users: ContactModel[] = [];
  fieldTextType!: boolean;
  checkSkeleton = false;
  total = 0;
  page = 1;
  prevPage = 1;
  searchBranch!: string;
  deleteId!: string;
  employeesFake: EmployeeModel[] = [];
  initalValues!: BillModel;
  billsData: BillModel[] | any = [];
  checkedValGet: any[] = [];
  checkedVal: any[] = [];
  startDate!: string;
  endDate!: string;
  selectedDate!: string;

  constructor(
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private service: BillService,
    private listService: ServicesService,
    private employeesService: EmployeesService,
    private contactsService: ContactsService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.employeesForm = this.formBuilder.group({
      ids: [""],
      fullname: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      age: ["", [Validators.required]],
      job: ["", [Validators.required]],
      yearExp: ["", [Validators.required]],
      idBranch: ["", [Validators.required]],
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });

    this.getListServices();
    this.getAllEmployees();
    this.getAllUser();
    this.getAllBill(this.page);
  }

  getAllBill(page: number, start?: string, end?: string): void {
    const pageToLoad: number = page || this.page || 1;
    const objQuery: Filter = {
      page: pageToLoad,
    };

    start ? (objQuery["start"] = start) : "";
    end ? (objQuery["end"] = end) : "";

    this.checkSkeleton = false;
    this.service.getAllBill(objQuery).subscribe({
      next: (data: any) => {
        this.billsData = data.users;
        this.page = page!;
        this.total = data.count;
        this.checkSkeleton = true;
      },
      error: () => (this.checkSkeleton = false),
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
    this.getAllBill(currentPageNumber, this.startDate, this.endDate);
  }

  /**
   * @param content
   */
  openModal(content: any): void {
    this.submitted = false;
    this.employeesForm.get("password")!.setValidators([Validators.required]);

    setTimeout(() => {
      let required = document.getElementById("password-required");
      required?.classList.add("required");
    }, 100);

    this.employeesForm.get("password")!.updateValueAndValidity();
    this.employeesForm.reset();
    this.modalService.open(content, {
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
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

  confirm(content: any, id: any): void {
    this.deleteId = id;
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  deleteData(id: string): void {
    if (id) {
      const toastRef = this.toast.loading("Loading...", {
        duration: 5000,
        position: "top-center",
      });

      this.service
        .deleteBill(id)
        .pipe(finalize(() => toastRef.close()))
        .subscribe({
          next: () => {
            this.getAllBill(this.page, this.startDate, this.endDate);
            this.toast.success("Delete bill successfully", {
              duration: 2000,
              position: "top-center",
            });
          },
          error: () => {
            this.toast.error("Delete bill in failed", {
              duration: 2000,
              position: "top-center",
            });
          },
        });
      document.getElementById("l_" + id)?.remove();
    } else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById("l_" + item)?.remove();
      });

      this.toast.success("Delete bill successfully", {
        duration: 2000,
        position: "top-center",
      });
    }
  }

  deleteMultiple(content: any): void {
    const checkboxes: any = document.getElementsByName("checkAll");
    let result;
    let checkedVal: any[] = [];

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
        duration: 2000,
        position: "top-center",
      });
    }

    this.checkedValGet = checkedVal;
  }

  checkUncheckAll(ev: any): void {
    this.billsData.forEach(
      (employee: any) => (employee.state = ev.target.checked)
    );
    const checkedVal: any[] = this.billsData.filter(
      (employee: any) => employee.state === true
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

  toggleFieldTextType(): void {
    this.fieldTextType = !this.fieldTextType;
  }

  getAllEmployees(): void {
    this.employeesService.getAllEmployees().subscribe((data: any) => {
      this.employeesFake = data.body.users;
    });
  }

  checkEmployeeName(item: BillModel): string {
    const result = this.employeesFake?.find((x: any) => x._id === item.idEmp);
    return result ? result.fullname : "N/A";
  }

  checkUserName(item: BillModel): string {
    const result = this.users?.find((x: any) => x._id === item.idUser);
    return result ? result.fullname : "Anonymous";
  }

  getListServices(): void {
    this.listService.getAllServices().subscribe((data: any) => {
      this.listServiceData = Object.assign([], data.users);
    });
  }

  checkNameServices(item?: string): string {
    const service = this.listServiceData.find((s: any) => s._id === item);
    return service ? service.name : "N/A";
  }

  getAllUser(): void {
    this.contactsService
      .getAllUser()
      .pipe(
        tap((data: any) => {
          this.users = data.body.users;
        }),
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe();
  }

  onChangeTime(e: any): void {
    const [start, end] = e.target.value.split(" to ");
    this.startDate = start;
    this.endDate = end;
    if (start && end) {
      this.getAllBill(1, start, end);
    } else if (!start && !end) {
      this.getAllBill(1);
    }
  }

  clearFilter(): void {
    this.startDate = this.endDate = this.selectedDate = "";
    this.getAllBill(1);
  }

  checkClassStatus(status: string): string {
    switch (status) {
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
}
