import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as bcrypt from "bcrypt";
import * as passport from "passport";
import { Strategy as LocalStrategy } from "passport-local"
import Db from "../database/Db";
/// <reference path="../../src/customTypes/customTypes.ts"/>

export default class Controller {
  // Passport.js strategy config
  static passportCongif(): void {
    passport.use(
      new LocalStrategy(
        (username: string, password: string, done: Function): void => {
          // Match user
          Db
            .findOne({ username: username }, "libraryEmployees")
            .then((dbRes) => {
              const user: customTypes.Employee = JSON.parse(dbRes);
              if (!user) {
                return done(null, false);
              }
              // Match password
              bcrypt
                .compare(password, user.password)
                .then((isMatch: boolean) => {
                  return isMatch ? done(null, user) : done(null, false);
                })
                .catch(err => console.log(err));

            })
            .catch(err => console.log(err));
        }
      )
    );
  }
  // Default admin check
  static adminInit() {
    Db
      .find({ username: "admin" }, "libraryEmployees")
      .then((dbRes: string) => {
        JSON.parse(dbRes).length || Controller.defaultAdmin();
      });
  }
  // Default admin config
  private static defaultAdmin() {
    let { username, password } = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../../", "appconfig.json"),
        "utf8"
      )
    ).defaultAdmin;

    bcrypt.genSalt(10, (err: Error, salt: string) => {
      if (err) throw err;

      bcrypt.hash(password, salt, (err: Error, hash: string) => {
        if (err) throw err;

        const admin: customTypes.Employee = {
          username,
          password: hash
        }

        Db.insertOne(admin, "libraryEmployees")
      })
    });
  }
  // GET routes
  static GET(app: express.Application): void {
    Controller.homepage(app);
    Controller.login(app);
    Controller.dashboard(app);
  }

  private static homepage(app: express.Application) {
    app.get("/", (req: express.Request, res: express.Response): void => {
      res.render("index");
    });
  }

  private static login(app: express.Application) {
    app.get("/login", (req: express.Request, res: express.Response): void => {
      res.render("login");
    });
  }

  private static dashboard(app: express.Application) {
    app.get("/dashboard", (req: express.Request, res: express.Response): void => {
      res.render("dashboard");
    });
  }
  // POST routes
  static POST(app: express.Application): void {
    Controller.booksQuery(app);
    Controller.userLogin(app);
  }

  private static booksQuery(app: express.Application) {
    app.post(
      "/books",
      (req: express.Request, res: express.Response): void => {
        const { author, title, year, language } = req.body;
        const query: object[] = [];

        author && query.push({
          author: { $regex: new RegExp(author, "i") }
        });
        title && query.push({
          title: { $regex: new RegExp(title, "i") }
        });
        year && query.push({
          year: { $regex: new RegExp(year, "i") }
        });
        language && query.push({
          language: { $regex: new RegExp(language, "i") }
        });

        const dbQuery: object = query.length ?
          { $and: query } :
          {};
        Db
          .find(dbQuery, "libraryBooks")
          .then((dbRes: string) => res.json(dbRes));
      });
  }

  private static userLogin(app: express.Application): void {
    app.post(
      "/login",
      passport.authenticate(
        'local',
        {
          successRedirect: '/dashboard',
          failureRedirect: '/login',
          session: false
        }
      )
    );
  }
}