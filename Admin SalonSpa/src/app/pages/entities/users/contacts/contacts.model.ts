import { Gender, RoleSpa } from "src/app/app.constant";

export interface ContactModel {
  createdAt: string;
  email: string;
  fullname: string;
  gender: Gender;
  role: RoleSpa;
  status: string;
  updatedAt: string;
  state: boolean;
  _id: string;
  timestamp: string;
  phone: string | number;
}

export interface ContactsResponse {
  count: number;
  current_page: string;
  total_page: number;
  users: ContactModel[];
}

export enum Column {
  Id = "Id",
  Name = "Name",
  Email = "Email",
  Phone = "Phone",
  Role = "Role",
  Status = "Status",
  Gender = "Gender",
}
