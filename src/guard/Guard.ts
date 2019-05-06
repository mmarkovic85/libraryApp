import { Request, Response, Application, NextFunction } from "express";
import * as pass from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import * as bcrypt from "bcrypt";
import Controller from "../controller/Controller";
import { Employee } from "../types/Types";

export default class Guard {
  // Security config
  static config(): void {
    Guard.passportStrategy();
    Guard.sessionStart();
    Guard.sessionEnd();
  }

  static async generateHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  // Passport strategy config
  private static passportStrategy(): void {
    pass.use(new LocalStrategy(
      (username: string, password: string, done: Function): void => {
        // Match user
        Controller
          .findOne({ username }, "libraryEmployees")
          .then((user: Employee): void => {
            if (!user) {
              return done(null, false, { message: "Input valid username!" });
            }

            // Match password
            bcrypt
              .compare(password, user.password)
              .then((isMatch: boolean): void => {
                return isMatch ?
                  done(null, user) :
                  done(null, false, { message: "Password incorrect!" });
              });
          });
      }
    ));
  }

  // Session - start
  private static sessionStart(): void {
    pass.serializeUser((user: Employee, done: Function): void => {
      done(null, user._id);
    });
  }

  // Session - end
  private static sessionEnd(): void {
    pass.deserializeUser((_id: string, done: Function): void => {
      Controller
        .findOne({ _id }, "libraryEmployees")
        .then((user: Employee): void => {
          done(null, user);
        });
    });
  }

  // Authentication middleware
  static readonly authenticate: Application = pass.authenticate(
    "local",
    {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
      failureFlash: true
    }
  )



  // Session - middleware gate
  static ensureAuthenticated(
    req: Request, res: Response, next: Function
  ): void {

    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  }

  // Session - employee passthrough middleware
  static forwardEmployee(
    req: Request,
    res: Response,
    next: NextFunction): void {

    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  }

  // Session - admin passthrough middleware
  static forwardAdmin(
    req: Request,
    res: Response,
    next: NextFunction): void {

    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    res.redirect("/dashboard");
  }
}