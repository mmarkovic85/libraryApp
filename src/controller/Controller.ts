import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as bcrypt from "bcrypt";
import Db from "../database/Db";
/// <reference path="../../src/customTypes/customTypes.ts"/>

export default class Controller {
  static adminInit() {
    Db
      .find({ username: "admin" }, "libraryEmployees")
      .then((dbRes: string) => {
        JSON.parse(dbRes).length || Controller.defaultAdmin();
      });
  }

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
          _id: "-1",
          username,
          password: hash
        }

        Db.insertOne(admin, "libraryEmployees")
      })
    });
  }

  static GET(app: express.Application): void {
    Controller.homepage(app);
    Controller.login(app);
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

  static POST(app: express.Application): void {
    Controller.booksQuery(app);
  }

  private static booksQuery(app: express.Application) {
    app.post(
      "/books",
      express.urlencoded({ extended: false }),
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
}