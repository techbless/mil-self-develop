import { Router } from "express";
import IndexController from "../controllers";
import wrapAsync from "./async.wrapper";

class IndexRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.get("/", wrapAsync(IndexController.index));
  }
}

export default new IndexRouter().router;
