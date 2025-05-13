import { Book } from "./book";

export interface Cart {
  id: string;
  userId: string;
  totalBooksInCart: number;
  cartBooks: {
    bookQuantity: number;
    book: Book;
  }[];
}
