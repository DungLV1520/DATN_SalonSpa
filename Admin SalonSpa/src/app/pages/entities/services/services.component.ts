import { DecimalPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
  FormGroup,
} from "@angular/forms";
import { HotToastService } from "@ngneat/hot-toast";
import {
  EMPTY,
  Subject,
  catchError,
  debounceTime,
  finalize,
  takeUntil,
  tap,
} from "rxjs";
import { ServicesService } from "./services.service";
import { ServicesModel, StatusService } from "./services.model";
import { Filter, GlobalComponent } from "src/app/app.constant";

@Component({
  selector: "app-services",
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.scss"],
  providers: [DecimalPipe],
})
export class ServicesComponent implements OnInit {
  breadCrumbItems = [{ label: "Services" }, { label: "List", active: true }];
  pagesize = GlobalComponent.ITEMS_PER_PAGE;
  serviceForm!: UntypedFormGroup | any;
  statusService = Object.values(StatusService);
  listService: ServicesModel[] = [];
  serviceDetail!: ServicesModel;
  initalValues!: ServicesModel;
  searchForm!: FormGroup;
  checkSkeleton = false;
  submitted = false;
  page = 1;
  total = 0;
  prevPage = 1;
  deleteId!: string;
  startDate!: string;
  endDate!: string;
  selectedDate!: string;
  private destroySubject = new Subject();

  constructor(
    private service: ServicesService,
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.formBuilder.group({
      id: [""],
      name: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      status: ["", [Validators.required]],
      image: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$"
          ),
        ],
      ],
      description: ["", [Validators.required]],
    });

    this.searchForm = this.formBuilder.group({
      searchTerm: [""],
    });

    this.onSearch();
    this.loadListServices(this.page);
  }

  loadListServices(
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
    this.service.getAllServices(objQuery).subscribe({
      next: (data: any) => {
        this.listService = Object.assign([], data.users);
        this.serviceDetail = this.listService[0];
        this.page = page!;
        this.total = data.count;
        this.checkSkeleton = true;
      },
      error: () => {
        this.checkSkeleton = false;
      },
    });
  }

  onSearch(): void {
    this.searchForm
      .get("searchTerm")!
      .valueChanges.pipe(debounceTime(500), takeUntil(this.destroySubject))
      .subscribe((searchTerm) => {
        this.prevPage = 1;
        this.loadListServices(
          this.prevPage,
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
    this.loadListServices(
      currentPageNumber,
      this.searchForm.get("searchTerm")!.value,
      this.startDate,
      this.endDate
    );
  }

  viewmore(id: any): void {
    this.serviceDetail = this.listService[id];
  }

  createService(): void {
    this.submitted = true;
    if (!this.serviceForm.valid) {
      return;
    }

    const service$ = this.serviceForm.get("id")?.value
      ? this.service.updateService(
          this.serviceForm.get("id")!.value,
          this.serviceForm.value
        )
      : this.service.addServices(this.serviceForm.value);

    const toastRef = this.toast.loading("Loading...", {
      duration: 5000,
      position: "top-center",
    });

    service$
      .pipe(
        tap(() => {
          const message = this.serviceForm.get("id")?.value
            ? "Update service successfully"
            : "Add service successfully";
          this.toast.success(message, {
            duration: 3000,
            position: "top-center",
          });
          this.modalService.dismissAll();
          this.loadListServices(
            this.page,
            this.searchForm.get("searchTerm")!.value,
            this.startDate,
            this.endDate
          );
          this.serviceForm.reset();
        }),
        catchError((error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-center",
          });
          return EMPTY;
        }),
        finalize(() => toastRef.close())
      )
      .subscribe();
  }

  editDataGet(content: any, item: ServicesModel): void {
    this.submitted = false;
    this.modalService.open(content, {
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });

    const modelTitle = document.querySelector(
      ".modal-title"
    ) as HTMLAreaElement;
    modelTitle.innerHTML = "Edit Service";
    const updateBtn = document.getElementById("add-btn") as HTMLAreaElement;
    updateBtn.innerHTML = "Update";

    this.serviceForm.controls["name"].setValue(item.name);
    this.serviceForm.controls["image"].setValue(item.image);
    this.serviceForm.controls["amount"].setValue(item.amount?.$numberDecimal);
    this.serviceForm.controls["id"].setValue(item._id);
    this.serviceForm.controls["description"].setValue(item.description);
    this.serviceForm.controls["status"].setValue(item.status);

    this.initalValues = this.serviceForm.value;
  }

  checkEnableSave(): boolean {
    return (
      JSON.stringify(this.serviceForm.value) ===
      JSON.stringify(this.initalValues)
    );
  }

  deleteService(id?: string): void {
    if (!id) return;

    const toastRef = this.toast.loading("Loading...", {
      duration: 5000,
      position: "top-center",
    });

    this.service
      .deleteService(id)
      .pipe(
        tap(() => {
          this.loadListServices(
            this.page,
            this.searchForm.get("searchTerm")!.value,
            this.startDate,
            this.endDate
          );

          this.toast.success("Delete service successfully", {
            duration: 3000,
            position: "top-center",
          });
        }),
        catchError((error) => {
          this.toast.error(error, {
            duration: 3000,
            position: "top-center",
          });
          return EMPTY;
        }),
        finalize(() => toastRef.close())
      )
      .subscribe(() => {
        this.loadListServices(this.page);
      });
  }

  confirm(content: any, id: string): void {
    this.deleteId = id;
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  /**
   * @param content
   */
  openModal(content: any): void {
    this.submitted = false;
    this.serviceForm.reset();
    this.modalService.open(content, {
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  get form() {
    return this.serviceForm.controls;
  }

  onChangeTime(e: any): void {
    const [start, end] = e.target.value.split(" to ");
    this.startDate = start;
    this.endDate = end;
    if (start && end) {
      this.loadListServices(
        1,
        this.searchForm.get("searchTerm")!.value,
        start,
        end
      );
    } else if (!start && !end) {
      this.loadListServices(1, this.searchForm.get("searchTerm")!.value);
    }
  }

  clearFilter(): void {
    this.startDate = this.endDate = this.selectedDate = "";
    this.searchForm.reset();
  }
}
