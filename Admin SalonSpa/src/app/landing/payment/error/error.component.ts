import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GlobalComponent } from "src/app/app.constant";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { BillService } from "src/app/pages/ecommerce/bill-admin/bills.service";
import { Socket, io } from "socket.io-client";
import { User } from "src/app/core/models/auth.models";

@Component({
  selector: "app-error",
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.scss"],
})
export class ErrorComponent {
  year: number = new Date().getFullYear();
  _seconds = 61;
  socket!: Socket<DefaultEventsMap>;
  objLocal!: User;

  constructor(
    private route: ActivatedRoute,
    private billService: BillService
  ) {}

  ngOnInit(): void {
    this.getParamURL();
  }

  getParamURL(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.socketPaymentMess(params.token);
      this.changeStatusSuccess("failed", params.id_bill);
    });
  }

  changeStatusSuccess(status: string, id_bill: string): void {
    const objSuccess = {
      status,
      id_bill,
    };

    this.billService.handleBillStatus(objSuccess).subscribe();
  }

  socketPaymentMess(token: string): void {
    this.objLocal = JSON.parse(
      localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
    );

    this.socket = io(GlobalComponent.SOCKET_ENDPOINT, {
      auth: {
        token: localStorage.getItem(GlobalComponent.TOKEN_KEY),
      },
    });

    this.socket.emit("join", token);
    this.socket.emit("messages", { room: token, data: { isPayment: false } });
  }
}
