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
    this.router.get(
      "/select_unit",
      isAuthenticated,
      UnitController.getUpdateUnit
    );
    this.router.post(
      "/select_unit",
      isAuthenticated,
      wrapAsync(UnitController.postUpdateUnit)
    );
  }
}

export default new UnitRouter().router;
