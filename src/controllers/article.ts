import { Request, Response } from "express";
import ArticleService from "../services/article";
import * as moment from "moment";

class ArticleController {
  public async getEditor(req: Request, res: Response) {
    const userId: number = req.user?.userId as number;
    const isUpdating = req.query.update;

    if (isUpdating === "true") {
      const articleIdInString = req.query.articleId;

      if (articleIdInString === "") {
        res.send("Article Id is not sepecified");
        return;
      }

      const articleId: number = +articleIdInString!;
      const article = await ArticleService.getArticle(articleId);

      const author = await article?.getUser();
      if (author?.userId !== req.user?.userId) {
        res.render("article/view", {
          title: "Not Authorized",
          markdown: "# You don't have it",
        });

        return;
      }

      res.render("article/editor", {
        date: moment(article?.createdAt).format("DD-MMM"),
        updating: true,
        article,
      });
    }

    const article = await ArticleService.getTodayArticle(userId);
    if (article) {
      res.render("article/editor", {
        date: moment(article?.createdAt).format("DD-MMM"),
        updating: true,
        article,
      });
    } else {
      res.render("article/editor", {
        date: moment().format("DD-MMM"),
        updating: false,
        article: null,
      });
    }
  }

  public getCalendar(req: Request, res: Response) {
    res.render("calendar");
  }

  public async getArticle(req: Request, res: Response) {
    try {
      const articleIdInString: string = req.query.articleId as string;
      const articleId = +articleIdInString;

      const result = await ArticleService.getArticle(articleId);

      const author = await result?.getUser();
      if (author?.userId === req.user?.userId) {
        const escapedMarkdown = result?.markdown
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
          .replace(/`/g, "&#96;");

        res.render("article/view", {
          date: moment(result?.createdAt).format("DD-MMM"),
          articleId: result?.articleId,
          title: result?.subject,
          markdown: escapedMarkdown,
        });

        return;
      }

      res.render("article/view", {
        title: "Not Authorized",
        markdown: "# You are not the author",
      });
    } catch (err) {
      res.send(err);
    }
  }

  public async getArticles(req: Request, res: Response) {
    const userId: number = req.user?.userId as number;
    const monthInString: string = req.query.month as string;
    const month: number = +monthInString;
    const yearInString: string = req.query.year as string;
    const year: number = +yearInString;

    const result = await ArticleService.getArticlesByMonth(userId, year, month);
    res.json(result);
  }

  public async postArticle(req: Request, res: Response) {
    const userId: number = req.user?.userId as number;
    const subject: string = req.body.subject;
    const markdown: string = req.body.markdown;
    const articleIdInString: string = req.body.articleId;
    let articleId: number = +articleIdInString;

    try {
      let result;
      if (articleId === -999) {
        result = await ArticleService.addArticleTo(userId, subject, markdown);
        articleId = result.articleId;
      } else {
        const article = await ArticleService.getArticle(articleId);
        const user = await article?.getUser();

        if (user?.userId == userId) {
          await ArticleService.updateArticle(
            userId,
            articleId,
            subject,
            markdown
          );
        }
      }

      res.redirect(`/article?articleId=${articleId}`);
    } catch (err) {
      res.send(err);
      return;
    }
  }
}

export default new ArticleController();
