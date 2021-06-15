import { Request, Response, NextFunction } from 'express';
import { IVerifyOptions } from 'passport-local';
import User from '../models/user';
import { Purpose } from '../models/token';

import passport = require('passport');

import UserService from '../services/user';
import TokenService from '../services/token';
import EmailService from '../services/email';
import Token from '../models/token';


class UserController {
  public getLogin = (req: Request, res: Response) => {
    if (req.user) {
      return res.redirect('/');
    }
    res.render('account/login', {
      title: 'Login',
    });
  };

  public postLogin = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error, user: User, info: IVerifyOptions) => {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }

      // eslint-disable-next-line no-shadow
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        res.redirect('/');
      });
    })(req, res, next);
  }

  public getRegister = (req: Request, res: Response) => {
    res.render('account/register', {
      title: 'Register',
    });
  }


  public getVerify = async(req: Request, res: Response) => {
    const { email, token, purpose } = req.query;
    

    if(!await TokenService.verifyToken(email as string, token as string, purpose as Purpose)) {
      console.log("failed");
      res.send('인증 실패');
      return;
    }

    UserService.verifyUser(email as string);
    res.send("인증 성공");
  }


  public postRegister = async (req: Request, res: Response) => {
    const user: User = await User.create({
      userName: req.body.username,
      email: req.body.email,
      password: req.body.password,
      rank: req.body.rank,
      isVerified: false,
      unitId: (req.body.unit_id !== '') ? req.body.unit_id : null,
      score: 0,
    });

    await EmailService.sendVerficationEmail(user, 'register');

    res.json(user);
  }


  public logout = (req: Request, res: Response) => {
    req.logout();
    res.redirect('/');
  };
}

export default new UserController();
