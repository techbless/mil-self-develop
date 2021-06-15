import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

passport.serializeUser(async (user: User, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id: number, done) => {
  const user = await User.findOne({
    where: {
      userId: id,
    },
  });

  done(null, user);
});


const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy(async (email, password, done) => {
    const user = await User.findOne({
      where: {
        email,
        //userName: username,
      },
    });

    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }

    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  }),
);


export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
    return;
  }

  if(!req.user.isVerified) {
    res.send("Please verify your email address");
    return;
  }

  return next();
};
