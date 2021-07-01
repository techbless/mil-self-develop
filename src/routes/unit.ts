import { Router } from "express";

import UnitController from "../controllers/unit";
import wrapAsync from "./async.wrapper";
import { isAuthenticated } from "../config/passport";

class UnitRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.get("/find_unit", wrapAsync(UnitController.getFindUnit));
    this.router.get("/search_unit", wrapAsync(UnitController.getSearchUnit));
    this.router.get(
      "/create_unit",
      isAuthenticated,
      UnitController.getCreateUnit
    );
    this.router.post(
      "/create_unit",
      isAuthenticated,
      wrapAsync(UnitController.postCreateUnit)
    );
  }
}

export default new UnitRouter().router;
