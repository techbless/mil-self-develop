import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import * as helmet from 'helmet';

import IndexRouter from './routes/index';
import UserRouter from './routes/user';
import EchoRouter from './routes/echo';
import UnitRouter from './routes/unit';
import RankRouter from './routes/rank';
import ArticleRouter from './routes/article';

class App {
  public app!: express.Application;

  constructor() {
    this.app = express();

    this.app.set('view engine', 'ejs');
    this.app.set('views', `${__dirname}/views`);

    // Prevent Security Issues
    // this.app.disable('x-powered-by');
    this.app.use(helmet());
    this.app.use(express.static(`${__dirname}/public`));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    /**
     * Recommendation: You should session store for saving session.
     */
    this.app.use(
      session({
        resave: true,
        saveUninitialized: true,
        secret: 'Input-your-own-secret-key-here.',
      }),
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    this.app.use('/', IndexRouter);
    this.app.use('/', UserRouter);
    this.app.use('/', UnitRouter);
    this.app.use('/', EchoRouter);
    this.app.use('/', RankRouter);
    this.app.use('/', ArticleRouter);
  }
}

export default new App().app;
