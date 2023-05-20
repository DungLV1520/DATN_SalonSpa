export interface Cart {
  _id: string;
  image: string;
  name: string;
  color: string;
  size: string;
  price: number;
  amount: { $numberDecimal: number };
  quantity: number;
  total: string;
  id: string;
}
