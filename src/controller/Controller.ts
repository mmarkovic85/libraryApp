import * as express from "express";
import Db from "../database/Db";

export default class Controller {

  static GET(app: express.Application): void {
    // homepage
    app.get("/", (req: express.Request, res: express.Response): void => {
      res.render("index");
    });
  }

  static POST(app: express.Application): void {
    // books search
    app.post(
      "/books",
      express.urlencoded({ extended: false }),
      (req: express.Request, res: express.Response): void => {
        const query: object[] = [];

        req.body.author && query.push({
          author: { $regex: new RegExp(req.body.author, "i") }
        });
        req.body.title && query.push({
          title: { $regex: new RegExp(req.body.title, "i") }
        });
        req.body.year && query.push({
          year: { $regex: new RegExp(req.body.year, "i") }
        });
        req.body.language && query.push({
          language: { $regex: new RegExp(req.body.language, "i") }
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