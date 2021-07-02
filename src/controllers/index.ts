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

      return;
    }

    try {
      let recommendedBooks = await InprocessingService.recommendBook(req.user!);
      recommendedBooks = await recommendedBooks.json();
      console.log("book done");
      const recommendedCerts = await InprocessingService.recommendCertificates(
        req.user!
      );

      console.log(recommendedCerts);
      res.render("index", {
        title: "Index",
        userName: req.user!.userName,
        books: recommendedBooks,
        certs: recommendedCerts,
      });
    } catch (err) {
      res.redirect("/books");
    }
  };
}

export default new IndexController();
