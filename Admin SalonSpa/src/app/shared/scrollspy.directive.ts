import {
  Directive,
  Input,
  EventEmitter,
  Inject,
  Output,
  ElementRef,
  HostListener,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Directive({
  selector: "[appScrollspy]",
})
export class ScrollspyDirective {
  @Input() public spiedTags: string[] = [];
  @Output() public sectionChange = new EventEmitter<string>();
  private currentSection: string | undefined;

  constructor(
    private _el: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @HostListener("window:scroll", ["$event"])
  onScroll(event: any) {
    let currentSection!: string;
    const children = this._el.nativeElement.querySelectorAll("section");
    const scrollTop = this.document.documentElement.scrollTop;
    const parentOffset = this.document.documentElement.offsetTop;

    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      if (this.spiedTags.some((spiedTag) => spiedTag === element.tagName)) {
        if (element.offsetTop - parentOffset <= scrollTop) {
          currentSection = element.id;
        }
      }
    }
    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.sectionChange.emit(this.currentSection);
    }
  }
}
