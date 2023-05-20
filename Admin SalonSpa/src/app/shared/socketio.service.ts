import { Injectable } from "@angular/core";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

@Injectable({
  providedIn: "root",
})
export class SocketioService {
  socket!: Socket<DefaultEventsMap>;
  constructor() {}

  sendMessage1(message: string): void {
    this.socket.emit("messages", { room: "1", message });
  }

  sendMessage2(message: string): void {
    this.socket.emit("messages", { room: "2", message });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
