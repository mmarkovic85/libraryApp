import * as express from "express";

export default class Router {

  static map(app: express.Application): void {
    Router.GET(app);
  }

  static GET(app: express.Application): void {
    // homepage
    app.get("/", (req: express.Request, res: express.Response): void => {
      res.render("index");
    });

    // error 404
    app.use((req: express.Request, res: express.Response): void => {
      res.status(404).render("404");
    });
  }

}