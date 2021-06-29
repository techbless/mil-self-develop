import { Request, Response } from "express";
import InprocessingService from "../services/inprocessing";

class IndexController {
  public index = async (req: Request, res: Response) => {
    if (!req.user) {
      res.render("index", {
        title: "Index",
        userName: "Guest",
        books: null,
      });
    }

    let recommendedBooks = await InprocessingService.recommendBook(req.user!);
    recommendedBooks = await recommendedBooks.json();

    res.render("index", {
      title: "Index",
      userName: req.user!.userName,
      books: recommendedBooks,
    });
  };
}

export default new IndexController();
