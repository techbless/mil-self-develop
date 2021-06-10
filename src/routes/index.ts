import { Router } from 'express';
import IndexController from '../controllers';

class IndexRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.get('/', IndexController.index);
  }
}

export default new IndexRouter().router;
