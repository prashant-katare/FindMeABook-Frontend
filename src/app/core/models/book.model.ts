export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  genreTag: string;
  price: number;
  isWishlisted: boolean;
  isInCart: boolean;
  imageUrl: string;
  rating: number;
  stockQuantity: number;
  genreId: number;
  quantitiesInCart: number;
}

export interface BookSection {
  genre: string;
  books: Book[];
}
