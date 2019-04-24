import { Application, Request, Response } from "express";
import Controller from "../controller/Controller";
import Guard from "../guard/Guard";

export default class Router {
  // GET routes
  static GET(app: Application): void {
    Router.homepage(app);
    Router.dashboard(app);
    Router.login(app);
    Router.logout(app);
  }

  private static homepage(app: Application): void {
    app.get(
      "/",
      (req: Request, res: Response): void => {
        res.render("index");
      }
    );
  }

  private static dashboard(app: Application): void {
    app.get(
      "/dashboard",
      Guard.ensureAuthenticated,
      (req: Request, res: Response): void => {
        res.render("dashboard", { name: req.user.username });
      }
    );
  }

  private static login(app: Application): void {
    app.get(
      "/login",
      Guard.forwardAuthenticated,
      (req: Request, res: Response): void => {
        res.render("login");
      }
    );
  }

  private static logout(app: Application): void {
    app.get(
      "/logout",
      (req: Request, res: Response): void => {
        req.logout();
        res.render("login");
      }
    );
  }
  // POST routes
  static POST(app: Application): void {
    Router.booksQuery(app);
    Router.userLogin(app);
  }

  private static booksQuery(app: Application): void {
    app.post(
      "/books",
      Controller.bookSearch
    );
  }

  private static userLogin(app: Application): void {
    app.post(
      "/login",
      Guard.authenticate
    );
  }
}