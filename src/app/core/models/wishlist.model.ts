export interface WishlistItemDTO {
  bookId: number;
  title: string;
  author: string;
  imageUrl: string;
  price: number;
  addedDate: string;
  isInCart: boolean;
  inStock: boolean;
} 