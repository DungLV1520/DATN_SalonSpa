import { Component } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import {
  Observable,
  catchError,
  finalize,
  from,
  of,
  switchMap,
  tap,
} from "rxjs";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ServicesService } from "../../entities/services/services.service";
import { ContactsService } from "../../entities/users/contacts/contacts.service";
import { ContactModel } from "../../entities/users/contacts/contacts.model";
import {
  ColorClass,
  Filter,
  Gender,
  GlobalComponent,
  RoleSpa,
} from "src/app/app.constant";
import { BranchModel } from "../../entities/branches/branches.model";
import { ServicesModel } from "../../entities/services/services.model";
import { EmployeeModel } from "../../entities/users/employees/employees.model";
import { BillModel, StatusBill } from "../bill-admin/bill-admin.model";
import { BillService } from "../bill-admin/bills.service";

@Component({
  selector: "app-bill-employee",
  templateUrl: "./bill-employee.component.html",
  styleUrls: ["./bill-employee.component.scss"],
  providers: [DecimalPipe],
})
export class BillEmployeeComponent {
  breadCrumbItems = [{ label: "Bills" }, { label: "List", active: true }];
  selectGender = Object.values(Gender);
  pagesize = GlobalComponent.ITEMS_PER_PAGE;
  employeesForm!: UntypedFormGroup;
  initalValues!: BillModel;
  billsData: BillModel[] | any = [];
  listServiceData: ServicesModel[] = [];
  branchesData: BranchModel[] = [];
  users: ContactModel[] = [];
  employeesFake: EmployeeModel[] = [];
  submitted = false;
  checkSkeleton = false;
  startDate!: string;
  searchBranch!: string;
  deleteId!: string;
  endDate!: string;
  selectedDate!: string;
  fieldTextType!: boolean;
  masterSelected!: boolean;
  total = 0;
  page = 1;
  prevPage = 1;
  checkedValGet: any[] = [];
  checkedVal: any[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private service: BillService,
    private listService: ServicesService,
    private contactsService: ContactsService
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

    const userDataLocal = JSON.parse(
      localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
    );

    const billsObservable: Observable<any> =
      userDataLocal.role === RoleSpa.ROLE_EMPLOYEE
        ? this.service.getAllMyBill(objQuery)
        : this.service.getBillsByBranch(objQuery);

    from(billsObservable)
      .pipe(
        switchMap((data: any) => {
          this.billsData = data.users;
          this.page = page!;
          this.total = data.count;
          return of(null);
        }),
        finalize(() => (this.checkSkeleton = true)),
        catchError((err) => of(err))
      )
      .subscribe();
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

  get form() {
    return this.employeesForm.controls;
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
