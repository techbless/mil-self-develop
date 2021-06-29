import { Router } from "express";

import UserController from "../controllers/user";
import InprocessingController from "../controllers/inprocessing";
import wrapAsync from "./async.wrapper";
import { isAuthenticated } from "../config/passport";

class UserRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.get("/register", UserController.getRegister);
    this.router.post("/register", wrapAsync(UserController.postRegister));

    this.router.get("/login", UserController.getLogin);
    this.router.post("/login", wrapAsync(UserController.postLogin));

    this.router.get("/verify", wrapAsync(UserController.getVerify));

    this.router.get(
      "/reset_page",
      wrapAsync(UserController.getPasswordResetPage)
    );
    this.router.get(
      "/send_password",
      wrapAsync(UserController.getSendPasswordMail)
    );
    this.router.get(
      "/reset_password",
      wrapAsync(UserController.getResetPassword)
    );
    this.router.post(
      "/reset_password",
      wrapAsync(UserController.postResetPassword)
    );

    this.router.get("/jobs", InprocessingController.getChooseJob);
    this.router.post("/jobs", wrapAsync(InprocessingController.postChooseJob));

    this.router.get("/book_list", wrapAsync(InprocessingController.getBooks));
    this.router.get(
      "/books",
      isAuthenticated,
      wrapAsync(InprocessingController.getChooseBook)
    );
    this.router.post(
      "/books",
      isAuthenticated,
      wrapAsync(InprocessingController.postChooseBook)
    );

    this.router.get("/logout", wrapAsync(UserController.logout));
  }
}

export default new UserRouter().router;
