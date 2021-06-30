import Bluebird = require("bluebird");
import { Request, Response } from "express";
import { readFile } from "fs";
import { resolve } from "path";
import InprocessingService from "../services/inprocessing";

class InprocessingController {
  public async getChooseJob(req: Request, res: Response) {
    const jobs = await InprocessingService.getJobCategories(req.user!);
    if (jobs.length >= 1) {
      res.redirect("/");
      return;
    }

    res.render("account/job", {
      title: "관심 직종 선택",
    });
  }

  public async postChooseJob(req: Request, res: Response) {
    const userId = req.user!.userId;
    const categories = req.body.categories as string[];

    await InprocessingService.setJobCategory(userId, categories);
    res.redirect("/");
  }

  public async getBooks(req: Request, res: Response) {
    const jsonPath = resolve(__dirname, "../assets/books.json");
    readFile(jsonPath, "utf8", (err, json) => {
      if (err) res.send("Failed to get book list");
      res.json(JSON.parse(json));
    });
  }

  public getChooseBook(req: Request, res: Response) {
    res.render("account/books", {
      title: "책 선택",
    });
  }

  public async postChooseBook(req: Request, res: Response) {
    const userId = req.user!.userId;
    const name = req.body.name;
    const author = req.body.author;

    await InprocessingService.addBook(userId, name, author);

    res.send("done");
  }
}

export default new InprocessingController();
