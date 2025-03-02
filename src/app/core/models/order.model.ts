import { Book } from "./book.model";

export interface Order {
  id: string;
  userId: string;
  username: string;
  createdAt: Date;
  totalPrice: number;
  status: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  bookId: number;
  bookTitle: string;
  quantity: number;
  price: number;
  orderId: string;
  imageUrl: string;
  book: Book;
}