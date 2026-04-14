export interface Post {
  id: number;
  title: string;
  content: string;
}

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export interface ItemToSell {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}
