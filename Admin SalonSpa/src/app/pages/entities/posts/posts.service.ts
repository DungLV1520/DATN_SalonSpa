import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Filter, GlobalComponent } from "src/app/app.constant";
import { PostModel } from "./posts.model";
import { createRequestOption } from "src/app/shared/request.util";

@Injectable({ providedIn: "root" })
export class PostService {
  constructor(private http: HttpClient) {}

  getAllPosts(req?: Filter) {
    const options = createRequestOption(req);
    return this.http.get(GlobalComponent.API_URL_LOCAL + `posts`, {
      params: options,
      observe: "response",
    });
  }

  getPostById(id: string) {
    return this.http.get(GlobalComponent.API_URL_LOCAL + `posts/${id}`);
  }

  addPost(post?: FormData) {
    return this.http.post(GlobalComponent.API_URL_LOCAL + `posts`, post);
  }

  updatePost(id?: string, post?: PostModel) {
    return this.http.patch(GlobalComponent.API_URL_LOCAL + `posts/${id}`, post);
  }

  deletePost(id?: string) {
    return this.http.delete(GlobalComponent.API_URL_LOCAL + `posts/${id}`);
  }
}
