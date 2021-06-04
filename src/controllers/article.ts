import { Request, Response, NextFunction } from 'express';
import ArticleService from '../services/article';


class ArticleController {
  public async getEditor(req: Request, res: Response) {
    res.render('article/editor')
  }

  public getCalendar(req: Request, res: Response) {
    res.render('calendar');
  }

  public async getArticle(req: Request, res: Response) {
    try {
      const articleIdInString: string = req.query.articleId as string;
      const articleId = +articleIdInString;
  
      const result = await ArticleService.getArticle(articleId);
      const escapedMarkdown = result?.markdown
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/`/g, "&#96;");

      res.render('article/view', {
        title: result?.subject,
        markdown: escapedMarkdown,
      })
    } catch(err) {
      res.send(err);
    }
  }

  public async postArticle(req: Request, res: Response) {
      const userId: number = req.user?.userId as number;
      const subject: string = req.body.subject;
      const markdown: string = req.body.markdown;

      try {
        const result = await ArticleService.addArticleTo(userId, subject, markdown);
        res.redirect(`/article?articleId=${result.articleId}`);
      } catch(err) {
        res.send(err);
        return;
      }

  }
}

export default new ArticleController();
