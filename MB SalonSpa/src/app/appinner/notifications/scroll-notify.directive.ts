import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[scrollNotify]',
})
export class ScrollNotiDirective {
  @Output() scrollEnd = new EventEmitter();

  constructor(private el: ElementRef) {}

  @HostListener('window:scroll', ['$event']) onWindowScroll() {
    const items = document.querySelectorAll('[scrollNotify]');
    const lastItem = items[items.length - 1];

    const rect = lastItem.getBoundingClientRect();
    if (rect.bottom <= window.innerHeight) {
      this.scrollEnd.emit();
    }
  }
}
