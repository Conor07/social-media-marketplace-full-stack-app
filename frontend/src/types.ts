export interface Post {
  id: number;
  title: string;
  content: string;
  userId: string;
  likes: string[];
}

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  userId: string;
}

export interface ItemToSell {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  userId: string;
}
