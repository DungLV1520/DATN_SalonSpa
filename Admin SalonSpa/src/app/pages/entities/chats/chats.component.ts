import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import {
  UntypedFormBuilder,
  Validators,
  UntypedFormGroup,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import { catchError, finalize, map, of, pluck, take, tap } from "rxjs";
import { DatePipe } from "@angular/common";
import { Socket, io } from "socket.io-client";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as moment from "moment";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { GlobalComponent, FilterAll, TypeNotify } from "src/app/app.constant";
import { User } from "src/app/core/models/auth.models";
import { TrackingModel } from "./chats.model";
import { ContactsService } from "../users/contacts/contacts.service";
import { ContactModel } from "../users/contacts/contacts.model";

@Component({
  selector: "app-chats",
  templateUrl: "./chats.component.html",
  styleUrls: ["./chats.component.scss"],
})
export class ChatComponent implements OnInit {
  @ViewChild("scrollRef") scrollRef: any;
  isProfile = "assets/images/users/avatar-2.jpg";
  dataTracking: TrackingModel[] = [];
  formData!: UntypedFormGroup;
  usermessage!: string;
  submitted = false;
  idUserName!: string;
  username = "SalonSpa";
  emoji = "";
  showLoading = false;
  showEmojiPicker = false;
  skeletonUser = false;
  set = "twitter";
  checkLoop!: string;
  idTrackPre!: string;
  chatMessagesData: any[] = [];
  objLocal!: User;
  arrayMessChat: any;
  users: ContactModel[] = [];
  userDetail!: ContactModel;
  checkTimestamp!: string;
  docRef: any;
  messLast: any;
  socket!: Socket<DefaultEventsMap>;

  constructor(
    public formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private offcanvasService: NgbOffcanvas,
    private contactsService: ContactsService,
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.objLocal = JSON.parse(
      localStorage.getItem(GlobalComponent.CUSTOMER_KEY)!
    );

    this.formData = this.formBuilder.group({
      message: ["", [Validators.required]],
    });

    this.socketChat();
    this.getAllUser();
    this.onListScroll();
    this.getAllTracking();
  }

  getAllUser(): void {
    const now = new Date();
    const isoString = now.toISOString();
    this.contactsService
      .getAllUser(FilterAll)
      .pipe(
        tap((data: any) => {
          this.users = data.body.users;
          this.idUserName = this.idUserName
            ? this.idUserName
            : this.users[0]._id;
          this.username = this.users[0].fullname;
          this.getAllChatFireStore(this.idUserName, isoString, true, true);
          this.getMessLast();
          this.checkParamUrl();
          this.socket.emit("join", this.users[0]._id);
        }),
        catchError(() => {
          return of();
        }),
        finalize(() =>
          setTimeout(() => {
            this.skeletonUser = true;
          }, 1000)
        )
      )
      .subscribe();
  }

  getAllChatFireStore(
    id: string,
    date: any,
    check: boolean,
    checkCall: boolean
  ) {
    if (checkCall) {
      this.docRef = this.db
        .collection("chat")
        .doc(id)
        .collection("messages", (ref) =>
          ref
            .orderBy("timestamp", "desc")
            .limit(10)
            .where("timestamp", "<", date || "")
        );
    } else {
      this.docRef = this.db
        .collection("chat")
        .doc(id)
        .collection("messages", (ref) =>
          ref.orderBy("timestamp", "desc").limit(1)
        );
    }

    this.docRef
      .valueChanges(take(1))
      .pipe(
        map((data: any) => {
          if (checkCall) {
            this.arrayMessChat = this.sortTimeStamp(data) ?? [];
            if (check) {
              this.chatMessagesData = [...this.arrayMessChat];
              this.checkScrollLimit();
            } else {
              if (this.arrayMessChat.length > 0) {
                this.chatMessagesData = [
                  ...this.arrayMessChat,
                  ...this.chatMessagesData,
                ];

                this.scrollRef.SimpleBar.getScrollElement().scrollTop += 90;
              }
            }
          } else {
            if (this.checkTimestamp !== data[0]?.timestamp) {
              this.chatMessagesData = [...this.chatMessagesData, ...data] ?? [];
              this.checkScrollLimit();
            }
            this.checkTimestamp = data[0]?.timestamp;
          }
        })
      )
      .subscribe();
  }

  socketChat(): void {
    this.socket = io(GlobalComponent.SOCKET_ENDPOINT, {
      auth: {
        token: localStorage.getItem(GlobalComponent.TOKEN_KEY),
      },
    });

    this.socket.on("thread", (data: any) => {
      if (data.align !== this.objLocal._id) {
        // this.chatMessagesData.push(data.obj);
      }
    });
  }

  getAllTracking(): void {
    this.db
      .collection("tracking-chat")
      .get()
      .pipe(
        map((data: any) => {
          this.dataTracking = data.docs.map((data: any) => {
            return {
              ...data.data(),
            };
          });

          this.checkNotiTracking(this.dataTracking);
        })
      )
      .subscribe();
  }

  getMessLast(): void {
    this.db
      .collection("chat", (ref) => ref.orderBy("timestamp", "desc"))
      .valueChanges()
      .pipe(
        map((data: any) => {
          this.messLast = data;
          if (this.checkLoop !== data[0]?.timestamp) {
            this.checkLoop = data[0]?.timestamp;
            for (let i = 0; i < this.users?.length; i++) {
              for (let j = 0; j < this.messLast?.length; j++) {
                if (this.users[i]._id === this.messLast[j].idUser) {
                  this.users[i]["timestamp"] = this.messLast[j]?.timestamp;
                  break;
                }
              }
            }

            this.sortDescTimeStamp(this.users);
          }
        })
      )
      .subscribe();
  }

  checkMessLastChat(mess: any): string {
    for (let i = 0; i < this.messLast?.length; i++) {
      if (this.messLast[i].idUser === mess._id) {
        let content = "";
        if (this.messLast[i].align === this.objLocal._id) {
          content = "You:" + " " + this.messLast[i].content;
        } else {
          content = this.messLast[i].content;
        }
        return content;
      }
    }

    return "";
  }

  checkIsRead(data: any): boolean {
    for (let i = 0; i < this.messLast?.length; i++) {
      if (this.messLast[i].idUser === data._id) {
        return this.messLast[i].isRead;
      }
    }

    return false;
  }

  getTimeLast(data: any): string {
    for (let i = 0; i < this.messLast?.length; i++) {
      if (this.messLast[i].idUser === data._id) {
        return this.getDisplayTime(this.messLast[i].timestamp);
      }
    }

    return "";
  }

  checkParamUrl(): void {
    const now = new Date();
    const isoString = now.toISOString();
    this.route.queryParams.pipe(pluck("id")).subscribe((params) => {
      this.idUserName = params ? params : this.users[0]._id;
      this.userDetail = this.userDetail || this.users[0];
      this.idTrackPre = this.idUserName;
      this.db
        .collection("tracking-chat")
        .doc(this.idUserName)
        .set({ id: this.idTrackPre, isRead: false, timestamp: isoString });

      for (let i = 0; i < this.users?.length; i++) {
        if (this.users[i]._id === params) {
          this.chatUserName(this.users[i]);
          return;
        }
      }
    });
  }

  checkNotiTracking(data: any): void {
    data.forEach((el: any) => {
      if (el.isRead) {
        this.db
          .collection("tracking-chat")
          .doc(el.id)
          .set({ ...el, isRead: false });
      }
    });
  }

  messageSave() {
    const message = this.formData.get("message")!.value;
    let currentTime = new Date();
    let messageTime = currentTime.toISOString();
    if (this.formData.valid && message) {
      const data = {
        align: this.objLocal._id,
        email: this.objLocal.email,
        content: message,
        time: this.datePipe.transform(new Date(), "h:mm a"),
        timestamp: messageTime,
        idUser: this.idUserName,
        isRead: true,
        type: TypeNotify.CHAT,
      };

      this.db
        .collection("chat")
        .doc(this.idUserName)
        .collection("messages")
        .add(data);

      this.db.collection("chat").doc(this.idUserName).set(data);

      this.getAllChatFireStore(this.idUserName, messageTime, true, false);
      this.socket.emit("messages", { room: this.objLocal._id, data });

      this.onListScroll();
      this.formData = this.formBuilder.group({
        message: null,
      });
    }

    document.querySelector(".replyCard")?.classList.remove("show");
    this.emoji = "";
    this.submitted = true;
  }

  chatUserName(data: any) {
    const now = new Date();
    const isoString = now.toISOString();
    this.showLoading = false;
    document.querySelector(".loading")?.classList.add("show-loading");
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 1000000000;
    this.userDetail = data;
    this.username = data.fullname;
    this.idUserName = data._id;
    this.usermessage = "";
    this.socket.emit("join", data._id);
    this.getAllChatFireStore(data._id, isoString, true, true);

    if (this.messLast) {
      let obj: any = {};
      for (let i = 0; i < this.messLast?.length; i++) {
        if (this.messLast[i].idUser === data._id) {
          obj = this.messLast[i];
          obj["isRead"] = true;
          break;
        }
      }

      this.db.collection("chat").doc(this.idUserName).set(obj);
    }

    const objTracking = {
      id: data._id,
      isRead: true,
      timestamp: isoString,
    };

    this.db
      .collection("tracking-chat")
      .doc(this.idTrackPre)
      .set({ ...objTracking, id: this.idTrackPre, isRead: false });

    this.db.collection("tracking-chat").doc(this.idUserName).set(objTracking);
    this.idTrackPre = data._id;

    const userChatShow = document.querySelector(".user-chat");
    if (userChatShow != null) {
      userChatShow.classList.add("user-chat-show");
    }

    this.router.navigate(["/chat"], { queryParams: { id: data._id } });
  }

  ngAfterViewInit() {
    this.checkScrollLimit();
    this.scrollRef?.SimpleBar.getScrollElement().addEventListener(
      "scroll",
      () => {
        if (this.scrollRef.SimpleBar.getScrollElement().scrollTop === 0) {
          document.querySelector(".loading")?.classList.remove("show-loading");
          this.showLoading = true;
          this.getAllChatFireStore(
            this.idUserName,
            this.chatMessagesData[0]?.timestamp,
            false,
            true
          );
        } else {
          document.querySelector(".loading")?.classList.add("show-loading");
          this.showLoading = false;
        }
      }
    );
  }

  sortTimeStamp(data: any): any {
    return data.sort((a: any, b: any) => {
      if (a.timestamp < b.timestamp) {
        return -1;
      }
      if (a.timestamp > b.timestamp) {
        return 1;
      }
      return 0;
    });
  }

  get form() {
    return this.formData.controls;
  }

  getDisplayTime(timestamp: string) {
    const date = moment(timestamp);
    const today = moment();
    const isSameDay = today.isSame(date, "day");

    if (isSameDay) {
      return date.format("h:mm A");
    }

    const yesterday = moment().subtract(1, "day");
    const isYesterday = yesterday.isSame(date, "day");

    if (isYesterday) {
      return "Yesterday";
    }

    if (today.diff(date, "days") < 7) {
      return date.format("ddd");
    }

    return date.format("D MMMM");
  }

  covertTime(messageTime: string): string {
    const now = moment();
    let formattedTime = "";
    // Kiểm tra xem tin nhắn có trong ngày hay không
    if (now.isSame(messageTime, "day")) {
      // Hiển thị định dạng "11:15 AM" hoặc "3:15 PM"
      formattedTime = moment(messageTime).format("h:mm A");
    } else {
      // Kiểm tra xem tin nhắn có trong tuần hay không
      if (now.isoWeek() === moment(messageTime).isoWeek()) {
        // Hiển thị định dạng "T4 12:15 AM" hoặc "T4 3:15 PM"
        formattedTime = moment(messageTime).format("ddd h:mm A");
      } else {
        // Hiển thị định dạng "11:15 AM ngày 15 tháng 1 2023"
        formattedTime = moment(messageTime).format("h:mm A D/MM/YYYY");
      }
    }

    return formattedTime;
  }

  sortDescTimeStamp(data: any): any {
    return data.sort((x: any, y: any) => {
      if (x.timestamp && y.timestamp) {
        if (x.timestamp < y.timestamp) {
          return 1;
        }
        if (x.timestamp > y.timestamp) {
          return -1;
        }
        return 0;
      } else if (x.timestamp) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  checkScrollLimit() {
    setTimeout(() => {
      if (this.scrollRef) {
        this.scrollRef!.SimpleBar!.getScrollElement().scrollTop = 100000;
      }
    }, 500);
  }

  onListScroll() {
    if (this.scrollRef !== undefined) {
      setTimeout(() => {
        this.scrollRef.SimpleBar.getScrollElement().scrollTop =
          this.scrollRef.SimpleBar.getScrollElement().scrollHeight;
      }, 300);
    }
  }

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: "end" });
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    const { emoji } = this;
    const text = `${emoji}${event.emoji.native}`;
    this.emoji = text;
    this.showEmojiPicker = false;
  }

  onFocus() {
    this.showEmojiPicker = false;
  }

  copyMessage(event: any) {
    navigator.clipboard.writeText(
      event.target.closest(".chat-list").querySelector(".ctext-content")
        .innerHTML
    );
    (document.getElementById("copyClipBoard") as HTMLElement).style.display =
      "block";
    setTimeout(() => {
      (document.getElementById("copyClipBoard") as HTMLElement).style.display =
        "none";
    }, 1000);
  }

  contactSearch() {
    let input: any,
      filter: any,
      ul: any,
      li: any,
      a: any | undefined,
      i: any,
      txtValue: any;
    input = document.getElementById("searchContact") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    ul = document.querySelectorAll(".chat-user-list");
    ul.forEach((item: any) => {
      li = item.getElementsByTagName("li");
      for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("p")[0];
        txtValue = a?.innerText;
        if (txtValue?.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
      }
    });
  }

  messageSearch() {
    let input: any,
      filter: any,
      ul: any,
      li: any,
      a: any | undefined,
      i: any,
      txtValue: any;
    input = document.getElementById("searchMessage") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    ul = document.getElementById("users-conversation");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("p")[0];
      txtValue = a?.innerText;
      if (txtValue?.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

  ngOnDestroy(): void {
    this.getAllTracking();
  }
}
