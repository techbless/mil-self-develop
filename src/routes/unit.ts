import { Router, Response, Request } from 'express';

import UnitController from '../controllers/unit';
import wrapAsync from './async.wrapper';

class UnitRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.get('/find_unit', wrapAsync(UnitController.getFindUnit));
    this.router.get('/search_unit', wrapAsync(UnitController.getSearchUnit));
  }
}

export default new UnitRouter().router;
