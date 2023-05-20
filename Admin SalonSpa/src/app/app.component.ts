import {Component} from "@angular/core";
import {io} from "socket.io-client";
import {SocketioService} from "./shared/socketio.service";
import {GlobalComponent} from "./app.constant";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
})
export class AppComponent {
    title = "SalonSpa";
    mess1: any;
    mess2: any;
    mess3: any;
    socket: any;

    constructor(private socketService: SocketioService) {
    }

    ngOnInit() {
        this.socket = io(GlobalComponent.SOCKET_ENDPOINT, {
            auth: {
                token: "abc",
            },
        });

        // this.socket.emit("messages", "Hello there from Angular.");
        this.socket.on("thread", (data: string) => {
        });
    }

    hello1(): void {
        this.socket.emit("join", "1");
        var message = "hello1";
        this.socket.emit("messages", {room: "1", message});
    }

    hello2(): void {
        this.socket.emit("join", "2");
        var message = "hello2";
        this.socket.emit("messages", {room: "2", message});
    }

    hello3(): void {
    }

    ngOnDestroy() {
        this.socketService.disconnect();
    }
}
