import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { takeWhile, timer } from "rxjs";
import { Socket, io } from "socket.io-client";

import { GlobalComponent, TypeNotify } from "src/app/app.constant";
import { BillService } from "src/app/pages/ecommerce/bill-admin/bills.service";

@Component({
  selector: "app-success",
  templateUrl: "./success.component.html",
  styleUrls: ["./success.component.scss"],
})
export class SuccessComponent {
  year: number = new Date().getFullYear();
  _seconds = 61;
  socket!: Socket<DefaultEventsMap>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private billService: BillService
  ) {}

  ngOnInit(): void {
    this.countdown();
    this.getParamURL();
  }

  getParamURL(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.changeStatusSuccess(
        "success",
        params.id_bill,
        params.token,
        params.idBranch,
        params.idUser
      );
    });
  }

  changeStatusSuccess(
    status: string,
    id_bill: string,
    token: string,
    idBranch: string,
    idUser: string
  ): void {
    const objSuccess = {
      status,
      id_bill,
    };

    this.billService.handleBillStatus(objSuccess).subscribe({
      next: () => {
        this.socketPaymentMess(token, idBranch, idUser, id_bill);
      },
    });
  }

  socketPaymentMess(
    token: string,
    idBranch: string,
    idUser: string,
    idBill: string
  ): void {
    this.socket = io(GlobalComponent.SOCKET_ENDPOINT, {
      auth: {
        token: localStorage.getItem(GlobalComponent.TOKEN_KEY),
      },
    });

    const objNotification = {
      room: GlobalComponent.SOCKET_ROOM_ID,
      data: {
        idUser: idUser,
        branch: idBranch,
        type: TypeNotify.PAYMENT,
        content: `The invoice #${idBill} has been successfully paid `,
      },
      isDuplicate: false,
      isPayment: true,
    };

    this.socket.emit("join", token);
    this.socket.emit("messages", {
      ...objNotification,
    });
    this.socket.emit("join", idBranch);
    this.coverData(objNotification);
    this.socket.emit("join", GlobalComponent.SOCKET_ROOM_ID);
    this.coverData(objNotification);
  }

  coverData(data: any): void {
    this.socket.emit("messages", {
      ...data,
      isDuplicate: true,
    });
  }

  countdown(): void {
    const countdown$ = timer(0, 1000).pipe(takeWhile(() => this._seconds > 0));

    countdown$.subscribe(() => {
      this._seconds--;
      if (this._seconds === 0) {
        this.router.navigateByUrl("/landing/booking");
      }
    });
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
