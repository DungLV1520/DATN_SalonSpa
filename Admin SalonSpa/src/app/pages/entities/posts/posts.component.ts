import { Component, OnInit } from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { PostService } from "./posts.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { HotToastService } from "@ngneat/hot-toast";
import {
  Subject,
  catchError,
  debounceTime,
  finalize,
  of,
  takeUntil,
  tap,
} from "rxjs";
import { Filter, GlobalComponent } from "src/app/app.constant";
import { PostModel } from "./posts.model";

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.scss"],
  providers: [PostService, DecimalPipe],
})
export class PostComponent implements OnInit {
  breadCrumbItems = [{ label: "Posts" }, { label: "List", active: true }];
  readonly MAX_FILE_SIZE = GlobalComponent.MAX_FILE_SIZE;
  pagesize = GlobalComponent.ITEMS_PER_PAGE;
  formData: FormData = new FormData();
  imageDefault = "assets/images/companies/img-3.png";
  postForm!: UntypedFormGroup;
  searchForm!: FormGroup;
  postData: PostModel[] = [];
  postDetail!: PostModel;
  imageURL!: string;
  selectedDate!: string;
  deleteId?: string;
  startDate!: string;
  image!: string;
  endDate!: string;
  submitted = false;
  fileCheck = false;
  checkSkeleton = false;
  page = 1;
  total = 0;
  prevPage = 1;
  private destroySubject = new Subject();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private postService: PostService,
    private modalService: NgbModal,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      ids: [""],
      title: ["", [Validators.required]],
      content: ["", [Validators.required]],
      image: [""],
    });

    this.searchForm = this.formBuilder.group({
      searchTerm: [""],
    });

    this.onSearch();
    this.loadAllPosts(this.page);
  }

  loadAllPosts(
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
    this.postService.getAllPosts(objQuery).subscribe({
      next: (data: any) => {
        this.postData = data.body.users;
        this.postDetail = this.postData[0];
        this.page = page!;
        this.total = data.body.count;
        this.checkSkeleton = true;
      },
      error: () => (this.checkSkeleton = false),
    });
  }

  onSearch(): void {
    this.searchForm
      .get("searchTerm")!
      .valueChanges.pipe(debounceTime(500), takeUntil(this.destroySubject))
      .subscribe((searchTerm) => {
        this.prevPage = 1;
        this.loadAllPosts(
          this.prevPage,
          searchTerm,
          this.startDate,
          this.endDate
        );
      });
  }

  getPostDetail(id: number): void {
    this.postDetail = this.postData[id];
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
    this.loadAllPosts(
      currentPageNumber,
      this.searchForm.get("searchTerm")!.value,
      this.startDate,
      this.endDate
    );
  }

  savePost(): void {
    this.submitted = true;
    if (this.postForm.invalid) {
      return;
    }

    const toastRef = this.toast.loading("Loading...", {
      duration: 5000,
      position: "top-center",
    });

    if (this.postForm.get("ids")?.value) {
      this.formData.append("title", this.postForm.value["title"]);
      this.formData.append("content", this.postForm.value["content"]);
      this.formData.append("_id", this.postForm.value["ids"]);

      if (!this.fileCheck) {
        this.formData.delete("image");
        this.formData.append("image", this.image);
        var jsonData = {} as any;
        this.formData.forEach((value, key) => (jsonData[key] = value));
      }

      this.postService
        .updatePost(
          this.postForm.get("ids")?.value,
          !this.fileCheck ? jsonData : this.formData
        )
        .pipe(finalize(() => toastRef.close()))
        .subscribe({
          next: () => {
            this.toast.success("Update post successfully", {
              duration: 3000,
              position: "top-center",
            });

            this.modalService.dismissAll();
            this.loadAllPosts(
              this.page,
              this.searchForm.get("searchTerm")!.value,
              this.startDate,
              this.endDate
            );
            this.formData = new FormData();
            jsonData = {};
            this.fileCheck = false;
          },
          error: (error) => {
            this.formData.delete("title");
            this.formData.delete("content");
            this.formData.delete("_id");
            this.toast.error(error, {
              duration: 3000,
              position: "top-center",
            });
          },
        });
    } else {
      this.formData.append("title", this.postForm.value["title"]);
      this.formData.append("content", this.postForm.value["content"]);

      this.postService
        .addPost(this.formData)
        .pipe(finalize(() => toastRef.close()))
        .subscribe({
          next: () => {
            this.toast.success("Add post successfully", {
              duration: 3000,
              position: "top-center",
            });
            this.modalService.dismissAll();
            this.loadAllPosts(
              this.page,
              this.searchForm.get("searchTerm")!.value,
              this.startDate,
              this.endDate
            );
            this.formData = new FormData();
            jsonData = {};
            this.postForm.reset();
          },
          error: (error) => {
            this.toast.error(error, {
              duration: 3000,
              position: "top-center",
            });
          },
        });
    }
  }

  editDataGet(content: any, item: PostModel): void {
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
    modelTitle.innerHTML = "Edit Post";
    const updateBtn = document.getElementById("add-btn") as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    const img_data = document.getElementById(
      "customer-img"
    ) as HTMLImageElement;

    img_data.src = item.image ? item.image : this.imageDefault;

    this.postForm.controls["title"].setValue(item.title);
    this.postForm.controls["content"].setValue(item.content);
    this.postForm.controls["ids"].setValue(item._id);
    this.image = item.image;
  }

  fileChange(event: any): void {
    let fileList: any = event.target as HTMLInputElement;
    let file: File = fileList.files[0];

    if (file) {
      this.fileCheck = true;
    }

    const files: File[] = Array.from(event.target.files);
    this.formData = new FormData();
    let fileSize = 0;

    for (const file of files) {
      fileSize += file.size / 1024 / 1024;
      if (fileSize > this.MAX_FILE_SIZE) {
        return;
      }
      this.formData.append("image", file, file.name);
    }

    this.postForm.patchValue({
      image_src: file.name,
    });

    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      (document.getElementById("customer-img") as HTMLImageElement).src =
        this.imageURL;
    };

    reader.readAsDataURL(file);
  }

  confirm(content: any, id: string): void {
    this.deleteId = id;
    this.modalService.open(content, {
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  deleteData(id?: string): void {
    if (id) {
      const toastRef = this.toast.loading("Loading...", {
        duration: 5000,
        position: "top-center",
      });

      this.postService
        .deletePost(id)
        .pipe(
          tap(() => {
            this.toast.success("Delete post successfully", {
              duration: 3000,
              position: "top-center",
            });
            this.loadAllPosts(
              this.page,
              this.searchForm.get("searchTerm")!.value,
              this.startDate,
              this.endDate
            );
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

  get form() {
    return this.postForm.controls;
  }

  /**
   * @param content
   */
  openModal(content: any): void {
    this.submitted = false;
    this.postForm.reset();
    this.modalService.open(content, {
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  onChangeTime(e: any): void {
    const [start, end] = e.target.value.split(" to ");
    this.startDate = start;
    this.endDate = end;
    if (start && end) {
      this.loadAllPosts(
        1,
        this.searchForm.get("searchTerm")!.value,
        start,
        end
      );
    } else if (!start && !end) {
      this.loadAllPosts(1, this.searchForm.get("searchTerm")!.value);
    }
  }

  clearFilter(): void {
    this.startDate = this.endDate = this.selectedDate = "";
    this.searchForm.reset();
  }
}
