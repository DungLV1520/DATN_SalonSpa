import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-appinner',
  templateUrl: './appinner.component.html',
})
export class AppinnerComponent implements OnInit {
  @ViewChild('HeaderEl', { read: ElementRef, static: false })
  headerView!: ElementRef;
  @ViewChild('mainPage', { read: ElementRef, static: false })
  mainPageView!: ElementRef;
  @ViewChild('mainContainer', { read: ElementRef, static: false })
  mainContainerView!: ElementRef;
  @ViewChild('FooterEl', { read: ElementRef, static: false })
  footerView!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterInit(): void {}

  ngAfterViewInit() {
    this.renderer.setStyle(
      this.mainPageView.nativeElement,
      'padding-top',
      this.headerView.nativeElement.offsetHeight + 10 + 'px'
    );
    this.renderer.setStyle(
      this.mainPageView.nativeElement,
      'min-height',
      window.outerHeight + 'px'
    );
    this.renderer.setStyle(
      this.mainContainerView.nativeElement,
      'min-height',
      window.outerHeight -
        this.headerView.nativeElement.offsetHeight -
        10 -
        this.footerView.nativeElement.offsetHeight +
        'px'
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    let header = document.getElementsByTagName('app-headerback')[0];
    let main = document.getElementsByTagName('html')[0];

    if (main.scrollTop > 15) {
      header.classList.add('active');
    } else {
      header.classList.remove('active');
    }
  }
}
