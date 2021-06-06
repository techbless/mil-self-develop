import { Router, Response, Request } from 'express';

import ArticleController from '../controllers/article';
import * as passportConfig from '../config/passport';
import wrapAsync from './async.wrapper';

class ArticleRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.get('/editor', passportConfig.isAuthenticated, wrapAsync(ArticleController.getEditor));
    this.router.get('/article', passportConfig.isAuthenticated, wrapAsync(ArticleController.getArticle));
    this.router.post('/article', passportConfig.isAuthenticated, wrapAsync(ArticleController.postArticle));

    this.router.get('/articles', passportConfig.isAuthenticated, wrapAsync(ArticleController.getArticles));

    this.router.get('/calendar', passportConfig.isAuthenticated, ArticleController.getCalendar);
  }
}

export default new ArticleRouter().router;
