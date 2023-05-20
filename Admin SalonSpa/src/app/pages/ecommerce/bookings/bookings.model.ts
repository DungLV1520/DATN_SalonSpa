import { ServicesModel } from "../../entities/services/services.model";

export interface BookingModel {
  _id: string;
  createdAt: string;
  gender: string;
  idUser: string;
  isCome: number;
  name: string;
  phone: string;
  time: string;
  updatedAt: string;
  state: boolean;
  branch: { _id: string; name: string };
  services: ServicesModel[];
  amount: { $numberDecimal: number };
  status: string;
}

export enum BookingStatus {
  Completed = "Completed",
  Activated = "Activated",
  Cancelled = "Cancelled",
}
