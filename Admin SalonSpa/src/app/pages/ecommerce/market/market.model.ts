export interface MarketModel {
  _id: string;
  name: string;
  description: string;
  price: number;
  status: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  quantity?: number;
}
