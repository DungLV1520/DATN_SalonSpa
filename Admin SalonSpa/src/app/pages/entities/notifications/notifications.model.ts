import { ContactModel } from "../users/contacts/contacts.model";

export interface NotificationModel {
  _id: string;
  content: string;
  createdAt: string;
  idUser: ContactModel;
  image: string;
  updatedAt: string;
}
