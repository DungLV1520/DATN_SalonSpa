import { Component, OnInit } from '@angular/core';
import { GlobalComponent } from 'src/app/app.constant';
import { AuthService } from 'src/app/core/services/auth.service';
import { Socket, io } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  socket!: Socket<DefaultEventsMap>;
  profileData: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getProfile();
  }

  menuopen() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.toggle('menu-open');
  }

  getProfile(): void {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.profileData = res.staff;
        this.socketBooking();
      },
    });
  }

  socketBooking(): void {
    this.socket = io(GlobalComponent.SOCKET_ENDPOINT, {
      auth: {
        token: localStorage.getItem(GlobalComponent.TOKEN_KEY),
      },
    });

    this.socket.emit('join', this.profileData?._id);

    this.socket.on('thread', () => {
      document.querySelector('.ring')?.classList.add('bell-icon');
      setTimeout(() => {
        document.querySelector('.ring')?.classList.remove('bell-icon');
      }, 15000);
    });
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
