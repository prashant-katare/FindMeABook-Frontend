export interface CartItemDTO {
  bookId: number;
  title: string;
  author: string;
  imageUrl: string;
  price: number;
  quantity: number;
  addedDate: string;
}

export interface Cart {
  items: CartItemDTO[];
  totalPrice: number;
  totalItems: number;
} 

