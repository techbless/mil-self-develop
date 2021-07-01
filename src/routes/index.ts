import { Router } from "express";
import IndexController from "../controllers";
import wrapAsync from "./async.wrapper";
import { isAuthenticated } from "../config/passport";

class IndexRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.get("/", isAuthenticated, wrapAsync(IndexController.index));
  }
}

export default new IndexRouter().router;
