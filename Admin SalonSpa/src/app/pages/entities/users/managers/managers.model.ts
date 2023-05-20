import { ContactModel } from "../contacts/contacts.model";

export interface ManagerModel {
  age: string;
  avatar: string;
  createdAt: string;
  fullname: string;
  gender: string;
  branch?: { _id?: string; name?: string };
  state: boolean;
  job: string;
  password: string;
  role: string;
  updatedAt: string;
  username: string;
  yearExp: number;
  _id: string;
  user: ContactModel;
}
