import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DatePipe } from "@angular/common";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore/";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { HotToastModule } from "@ngneat/hot-toast";
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { LayoutsModule } from "./layouts/layouts.module";
import { PagesModule } from "./pages/pages.module";
import { ErrorInterceptor } from "./core/helpers/error.interceptor";
import { environment } from "src/environments/environment";
import { JwtInterceptor } from "./core/helpers/jwt.interceptor";
import { SocketioService } from "./shared/socketio.service";

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: "en",
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    LayoutsModule,
    PagesModule,
    Ng2SearchPipeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    HotToastModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    SocketioService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
