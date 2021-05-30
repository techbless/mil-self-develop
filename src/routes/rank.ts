import { Router, Response, Request } from 'express';

import RankController from '../controllers/rank';
import wrapAsync from './async.wrapper';

class RankRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.get('/rank', RankController.getRank);
  }
}

export default new RankRouter().router;
