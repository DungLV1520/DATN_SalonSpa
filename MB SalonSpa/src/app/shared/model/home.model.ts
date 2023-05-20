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

export interface BranchModel {
  _id: string;
  address: string;
  createdAt: string;
  image: string;
  name: string;
  phone: string | number;
  location: string;
  updatedAt: string;
}

export interface PostModel {
  _id: string;
  content: string;
  createdAt: string;
  image: string;
  title: string;
  updatedAt: string;
}
