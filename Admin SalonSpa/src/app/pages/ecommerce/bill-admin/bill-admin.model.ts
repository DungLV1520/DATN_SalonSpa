export interface BillModel {
  _id?: string;
  createdAt?: string;
  idEmp?: ID_EMPLOYEE;
  idUser?: string;
  services?: string[];
  totalMoney?: number;
  updatedAt?: string;
  state?: boolean;
  typePayment?: string;
}

export interface ID_EMPLOYEE {
  _id: string;
  fullname: string;
  idBranch: { _id: string; name: string };
}

export enum StatusBill {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}
