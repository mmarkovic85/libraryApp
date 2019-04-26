import { Request, Response } from "express";
import * as PSST from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import * as bcrypt from "bcrypt";
import Controller from "../controller/Controller";
import { Employee } from "../customTypes/customTypes";
import { RequestHandlerParams } from "express-serve-static-core";

export default class Guard {
  // Security config
  static config(): void {
    Guard.passportStrategy();
    Guard.sessionStart();
    Guard.sessionEnd();
  }
  // Password hash method
  static async generateHash(password: string): Promise<string> {
    let res: string;

    try {
      await
        bcrypt
          .hash(password, 10)
          .then((hash: string): void => {
            res = hash;
          })
          .catch(err => console.log(err));
    } catch (err) {
      if (err) console.log(err);
    }

    return res;
  }
  // Passport strategy config
  private static passportStrategy(): void {
    PSST.use(
      new LocalStrategy(
        (username: string, password: string, done: Function): void => {
          // Match user
          Controller
            .findEmployee({ username })
            .then((user: Employee): void => {
              if (!user) {
                return done(null, false, { message: 'Input valid username!' });
              }
              // Match password
              bcrypt
                .compare(password, user.password)
                .then((isMatch: boolean): void => {
                  return isMatch ?
                    done(null, user) :
                    done(null, false, { message: 'Password incorrect!' });
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
      )
    );
  }
  // Session - start
  private static sessionStart(): void {
    PSST.serializeUser((user: Employee, done: Function): void => {
      done(null, user._id);
    });
  }
  // Session - end
  private static sessionEnd(): void {
    PSST.deserializeUser((_id: string, done: Function): void => {
      Controller
        .findEmployee({ _id })
        .then((user: Employee): void => {
          done(null, user);
        })
        .catch(err => console.log(err));
    });
  }
  // Authentication middleware
  static readonly authenticate: RequestHandlerParams = PSST.authenticate(
    'local',
    {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    }
  )
  // Session - middleware gate
  static ensureAuthenticated(req: Request, res: Response, next: Function): void {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
  // Session - employee passthrough middleware
  static skipLogin(req: Request, res: Response, next: Function): void {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  }

  // Session - admin passthrough middleware
  static forwardAdmin(req: Request, res: Response, next: Function): void {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    res.redirect('/dashboard');
  }
}