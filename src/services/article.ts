import Article from "../models/article";
import RankService from "../services/rank";

import { Op } from "sequelize";

class ArticleService {
  public async getArticle(articleId: number) {
    return Article.findOne({
      where: {
        articleId,
      },
    });
  }

  public async getArticlesByMonth(userId: number, year: number, month: number) {
    const startedDate = new Date(year, month - 1, 2);
    const endDate = new Date(year, month, 1);

    return Article.findAll({
      attributes: ["articleId", "subject", "createdAt"],
      where: {
        userId,
        createdAt: { [Op.between]: [startedDate, endDate] },
      },
    });
  }

  public async getTodayArticle(userId: number) {
    const startedDate = new Date();
    const endDate = new Date();
    startedDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 60, 0);

    return Article.findOne({
      where: {
        userId,
        createdAt: { [Op.between]: [startedDate, endDate] },
      },
    });
  }

  public async addArticleTo(userId: number, subject: string, markdown: string) {
    RankService.addScore(userId, 50);
    return Article.create({
      userId: userId,
      subject: subject,
      markdown: markdown,
    });
  }

  public async updateArticle(
    userId: number,
    articleId: number,
    subject: string,
    markdown: string
  ) {
    return Article.update(
      {
        subject,
        markdown,
      },
      {
        where: {
          userId,
          articleId,
        },
      }
    );
  }
}

export default new ArticleService();
