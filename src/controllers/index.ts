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
    let recommendedCerts;
    try {
      recommendedCerts = await InprocessingService.recommendCertificates(
        req.user!
      );
    } catch (err) {
      res.redirect("/jobs");
      return;
    }

    try {
      let recommendedBooks = await InprocessingService.recommendBook(req.user!);
      recommendedBooks = await recommendedBooks.json();
      console.log("book done");

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
