import Book from "../models/book";
import Job from "../models/job";
import User from "../models/user";

import fetch from "node-fetch";

class InprocessingService {
  public async setJobCategory(userId: number, categories: string[]) {
    for (const category of categories) {
      await Job.create({
        userId,
        category,
      });
    }
  }

  public async recommendBook(user: User) {
    const books = await user.getBooks();
    const book = books[0];
    console.log("-----", book);
    return fetch(
      `http://localhost:5000/recommend?orgTitle=${encodeURI(
        book.name
      )}&orgAuthor=${encodeURI(book.author)}`
    );
  }

  public async addBook(userId: number, name: string, author: string) {
    const escapedName = name.replace(/<[^>]*>?/gm, "");
    console.log(escapedName);
    Book.create({
      userId,
      name: escapedName,
      author,
    });
  }
}

export default new InprocessingService();
