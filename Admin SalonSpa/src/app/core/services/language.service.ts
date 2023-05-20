import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";

@Injectable({ providedIn: "root" })
export class LanguageService {
  public languages: string[] = ["en", "es", "de", "it", "vi"];

  constructor(
    public translate: TranslateService,
    private cookieService: CookieService
  ) {
    let browserLang: any;

    this.translate.addLangs(this.languages);
    if (this.cookieService.check("lang")) {
      browserLang = this.cookieService.get("lang");
    } else {
      browserLang = translate.getBrowserLang();
    }
    translate.use(browserLang.match(/en|es|de|it|vi/) ? browserLang : "en");
  }

  public setLanguage(lang: any) {
    this.translate.use(lang);
    this.cookieService.set("lang", lang);
  }
}
