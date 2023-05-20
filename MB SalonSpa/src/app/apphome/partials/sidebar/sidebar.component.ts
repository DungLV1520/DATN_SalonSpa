import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  account: any;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getProfile();
  }

  menuclose() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('menu-open');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/account/login']);
  }

  getProfile(): void {
    this.authService.getProfile().subscribe((data) => {
      // const privateKey = this.storageService.retrieve();
      // const decrypt = this.cryptoService.decript('', privateKey);
      this.account = data;
    });
  }
}
