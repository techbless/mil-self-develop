import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import User from "../models/user";
import { Purpose } from "../models/token";

import passport = require("passport");

import UserService from "../services/user";
import TokenService from "../services/token";
import EmailService from "../services/email";

class UserController {
  public getLogin = (req: Request, res: Response) => {
    if (req.user) {
      return res.redirect("/");
    }
    res.render("account/login", {
      title: "Login",
    });
  };

  public postLogin = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (err: Error, user: User, info: IVerifyOptions) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect("/login");
        }

        // eslint-disable-next-line no-shadow
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        });
      }
    )(req, res, next);
  };

  public getRegister = (req: Request, res: Response) => {
    res.render("account/register", {
      title: "Register",
    });
  };

  public getVerify = async (req: Request, res: Response) => {
    const { email, token, purpose } = req.query;

    if (
      !(await TokenService.verifyToken(
        email as string,
        token as string,
        purpose as Purpose,
        true
      ))
    ) {
      console.log("failed");
      res.send("인증 실패");
      return;
    }

    UserService.verifyUser(email as string);
    res.redirect("/login");
  };

  public postRegister = async (req: Request, res: Response) => {
    try {
      const user: User = await User.create({
        userName: req.body.username,
        email: req.body.email,
        password: req.body.password,
        rank: req.body.rank,
        isVerified: false,
        unitId: req.body.unit_id !== "" ? req.body.unit_id : null,
        score: 0,
      });

      await EmailService.sendVerficationEmail(user, "register");

      res.send("Please check your inbox and verify your email");
    } catch (err) {
      res.send(
        "Your username may be duplicated or some input are wrong. Please check your input."
      );
    }
  };

  public getPasswordResetPage = async (req: Request, res: Response) => {
    res.render("account/reset_password", {
      title: "Reset Password",
      isVerified: false,
    });
  };

  public getSendPasswordMail = async (req: Request, res: Response) => {
    const email: string = req.query.email as string;
    const user = await UserService.getUserByEmail(email);

    if (user) {
      EmailService.sendVerficationEmail(user, "reset");
      res.send("please check your inbox");
    } else {
      res.send("There is no such user");
    }
  };

  public getResetPassword = async (req: Request, res: Response) => {
    const email: string = req.query.email as string;
    const token: string = req.query.token as string;

    if (!(await TokenService.verifyToken(email, token, "reset", false))) {
      res.send("Failed to verify");
      return;
    }

    res.render("account/reset_password", {
      title: "Reset Password",
      isVerified: true,
      email,
      token,
    });
  };

  public postResetPassword = async (req: Request, res: Response) => {
    const email: string = req.body.email as string;
    const token: string = req.body.token as string;
    const password: string = req.body.password as string;

    if (!(await TokenService.verifyToken(email, token, "reset", true))) {
      res.send("Failed to verify");
      return;
    }

    await UserService.updatePassword(email, password);
    res.send("Password has been updated");
  };

  public logout = (req: Request, res: Response) => {
    req.logout();
    res.redirect("/");
  };
}

export default new UserController();
