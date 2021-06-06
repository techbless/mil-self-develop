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


    public async getArticlesByMonth(userId: number, year: number, month: number) {
        const startedDate = new Date(year, month - 1, 2);
        const endDate = new Date(year, month, 1);

        const result = await Article.findAll({
            attributes: ['articleId', 'subject', 'createdAt'],
            where: {
                userId,
                createdAt: {[Op.between]: [startedDate, endDate]},
            }
        })
        
        return result;
    }

    public async getTodayArticle(userId: number) {
        const startedDate = new Date();
        const endDate = new Date();
        startedDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 60, 0);

        

        const result = await Article.findOne({
            where: {
                userId,
                createdAt: {[Op.between]: [startedDate, endDate]},
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

    public async updateArticle(userId: number, articleId: number, subject: string, markdown: string) {
        const result = await Article.update(
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
        )
            
        return result;
    }
}

export default new ArticleService();