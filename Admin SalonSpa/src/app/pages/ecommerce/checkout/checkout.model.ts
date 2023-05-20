export interface PaymentModel {
  idEmpBill?: string;
  idMgmt?: string;
  totalMoney: number;
  services: string[];
  typePayment: string;
  idUser?: string;
  discount?: number;
}

export interface PayPalModel {
  paymentUrl?: string;
  qrCodeUrl?: string;
}
