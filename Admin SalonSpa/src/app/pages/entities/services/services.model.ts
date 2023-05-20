export interface ServicesModel {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  amount?: { $numberDecimal?: string | number | null } | null;
  status: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export enum StatusService {
  Active = "Active",
  Pending = "Pending",
  Reject = "Reject",
}
