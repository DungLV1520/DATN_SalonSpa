import { DecimalPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  Subject,
  catchError,
  debounceTime,
  finalize,
  of,
  takeUntil,
  tap,
} from "rxjs";
import { HotToastService } from "@ngneat/hot-toast";
import { BranchesService } from "./branches.service";
import { Filter, GlobalComponent } from "src/app/app.constant";
import { BranchModel } from "./branches.model";

@Component({
  selector: "app-branches",
  templateUrl: "./branches.component.html",
  styleUrls: ["./branches.component.scss"],
  providers: [DecimalPipe],
})
export class BranchesComponent implements OnInit {
  breadCrumbItems = [{ label: "Branches" }, { label: "List", active: true }];
  pagesize = GlobalComponent.ITEMS_PER_PAGE;
  branchesForm!: UntypedFormGroup | any;
  searchForm!: FormGroup;
  branches: BranchModel[] = [];
  initalValues!: BranchModel;
  submitted = false;
  checkSkeleton = false;
  total = 0;
  page = 1;
  prevPage = 1;
  deleteId?: string;
  startDate!: string;
  endDate!: string;
  selectedDate!: string;
  private destroySubject = new Subject();

  constructor(
    private branchesService: BranchesService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.branchesForm = this.formBuilder.group({
      ids: [""],
      name: ["", [Validators.required]],
      address: [""],
      phone: ["", [Validators.required]],
      location: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$"
          ),
        ],
      ],
      image: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$"
          ),
        ],
      ],
    });

    this.searchForm = this.formBuilder.group({
      searchTerm: [""],
    });

    this.onSearch();
    this.loadAllBranch(this.page);
  }

  loadAllBranch(
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
    this.branchesService.getAllBranches(objQuery).subscribe({
      next: (data: any) => {
        this.branches = data?.body?.users;
        this.page = page!;
        this.total = data.body.count;
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
        this.loadAllBranch(
          this.prevPage,
          searchTerm,
          this.startDate,
          this.endDate
        );
      });
  }

  get form() {
    return this.branchesForm.controls;
  }

  confirm(content: any, id: string) {
    this.deleteId = id;
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  deleteBranch(id?: string): void {
    if (id) {
      const toastRef = this.toast.loading("Loading...", {
        duration: 5000,
        position: "top-center",
      });

      this.branchesService
        .deleteBranch(id)
        .pipe(
          tap(() => {
            this.loadAllBranch(
              this.page,
              this.searchForm.get("searchTerm")!.value,
              this.startDate,
              this.endDate
            );
            this.toast.success("Delete branch successfully", {
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
        .subscribe(() => {
          this.loadAllBranch(this.page);
        });
    }
  }

  saveBranch(): void {
    this.submitted = true;
    if (this.branchesForm.valid) {
      const formData = this.branchesForm.value;
      const id = formData.ids;

      const branch$ = id
        ? this.branchesService.updateBranch(id, formData)
        : this.branchesService.addBranch(formData);

      const toastRef = this.toast.loading("Loading...", {
        duration: 5000,
        position: "top-center",
      });

      branch$
        .pipe(
          tap(() => {
            const message = id
              ? "Update branch successfully"
              : "Create branch successfully";
            this.toast.success(message, {
              duration: 3000,
              position: "top-center",
            });
            this.modalService.dismissAll();
            this.loadAllBranch(
              this.page,
              this.searchForm.get("searchTerm")!.value,
              this.startDate,
              this.endDate
            );
            if (!id) {
              this.branchesForm.reset();
            }
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
    this.loadAllBranch(
      currentPageNumber,
      this.searchForm.get("searchTerm")!.value,
      this.startDate,
      this.endDate
    );
  }

  /**
   * @param content
   */
  addBranch(content: any): void {
    this.modalService.open(content, {
      size: "md",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
    this.submitted = false;
    this.branchesForm.reset();
  }

  checkEnableSave(): boolean {
    return (
      JSON.stringify(this.branchesForm.value) ===
      JSON.stringify(this.initalValues)
    );
  }

  /**
   * @param content
   */
  editDataGet(content: any, item: any): void {
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
    modelTitle.innerHTML = "Edit Branch";
    const updateBtn = document.getElementById("add-btn") as HTMLAreaElement;
    updateBtn.innerHTML = "Update";

    this.branchesForm.controls["name"].setValue(item.name);
    this.branchesForm.controls["image"].setValue(item.image);
    this.branchesForm.controls["phone"].setValue(item.phone);
    this.branchesForm.controls["location"].setValue(item.location);
    this.branchesForm.controls["ids"].setValue(item._id);
    this.branchesForm.controls["address"].setValue(item.address);

    this.initalValues = this.branchesForm.value;
  }

  onChangeTime(e: any): void {
    const [start, end] = e.target.value.split(" to ");
    this.startDate = start;
    this.endDate = end;
    if (start && end) {
      this.loadAllBranch(
        1,
        this.searchForm.get("searchTerm")!.value,
        start,
        end
      );
    } else if (!start && !end) {
      this.loadAllBranch(1, this.searchForm.get("searchTerm")!.value);
    }
  }

  clearFilter(): void {
    this.startDate = this.endDate = this.selectedDate = "";
    this.searchForm.reset();
  }
}
