import { Component, OnInit } from "@angular/core";
import { FilterAll, GlobalComponent } from "src/app/app.constant";
import { PostModel } from "src/app/pages/entities/posts/posts.model";
import { PostService } from "src/app/pages/entities/posts/posts.service";

@Component({
  selector: "app-post",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.scss"],
})
export class PostComponent implements OnInit {
  postData: PostModel[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    const objLocal = JSON.parse(
      localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
    );

    if (objLocal?._id) {
      this.getAllPosts();
    }
  }

  getAllPosts(): void {
    this.postService.getAllPosts(FilterAll).subscribe({
      next: (data: any) => {
        this.postData = data.body.users;
      },
    });
  }

  nextSlide() {
    document.querySelectorAll(".slide-card")[0].classList.add("active");
    document
      .querySelector("#previous-arrow")!
      .classList.replace("bg-white", "bg-disabled");
    let count = document.querySelectorAll(".slide-card").length;

    document.querySelector("#previous-arrow")!.removeAttribute("disabled");
    (document.querySelector("#previous-arrow i")! as HTMLElement).style.color =
      "#212529";
    document
      .querySelector("#previous-arrow")!
      .classList.replace("bg-disabled", "bg-white");
    const elements = document.querySelectorAll(".slide-card");
    for (let index = 0; index <= count; index++) {
      let valueIndex = null;
      if (elements[index]?.classList?.contains("active")) {
        valueIndex = index;
      }

      elements[index]?.classList.remove("move-left");
      elements[elements.length - 1]?.classList.remove("move-left");
      setTimeout(() => {
        elements[index]?.classList.add("move-left");
      }, 0);
      setTimeout(() => {
        elements[index]?.classList.remove("active");
        elements[2]?.classList.add("active");
        elements[index]?.classList.remove("move-left");
        elements[elements.length - 1]?.classList.remove("move-left");
        document.querySelector(".slider-wrap")!.append(elements[0]);
      }, 200);
    }
  }

  previousSlide() {
    document.querySelectorAll(".slide-card")[0].classList.add("active");
    let count = document.querySelectorAll(".slide-card").length;

    const elements = document.querySelectorAll(".slide-card");
    document.querySelector(".slider-wrap")!.classList.add("slider-move-left");

    for (let index = 0; index <= count; index++) {
      setTimeout(() => {
        elements[index]?.classList.add("move-right");
      }, 0);
      setTimeout(() => {
        elements[index]?.classList.remove("active");
        elements[0]?.classList.add("active");
        elements[index]?.classList.remove("move-right");
        document
          .querySelector(".slider-wrap")!
          .prepend(elements[elements.length - 1]);
      }, 200);
    }
  }
}
