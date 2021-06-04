import Article from '../models/article';
import { Op } from 'sequelize';

class ArticleService {
    public async getArticle(articleId: number) {
        const result = await Article.findOne({
            where: {
                articleId,
            }
        });

        return result;
    }

    public async addArticleTo(userId:  number, subject: string, markdown: string) {
        const result = await Article.create({
            userId: userId,
            subject: subject,
            markdown: markdown,
        });

        return result;
    }
}

export default new ArticleService();