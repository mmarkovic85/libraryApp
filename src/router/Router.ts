import { Application, Request, Response } from "express";
import Controller from "../controller/Controller";
import Guard from "../guard/Guard";

export default class Router {
  // GET routes
  static GET(app: Application): void {
    Router.homepage(app);
    Router.search(app);
    Router.login(app);
    Router.dashboard(app);
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

  private static search(app: Application): void {
    app.get(
      "/search",
      (req: Request, res: Response): void => {
        res.render("search");
      }
    );
  }

  private static dashboard(app: Application): void {
    app.get(
      "/dashboard",
      Guard.ensureAuthenticated,
      Controller.dashboard
    );
  }

  private static login(app: Application): void {
    app.get(
      "/login",
      Guard.skipLogin,
      (req: Request, res: Response): void => {
        res.render("login", { msg: req.flash("error") });
      }
    );
  }

  private static logout(app: Application): void {
    app.get(
      "/logout",
      (req: Request, res: Response): void => {
        req.logout();
        res.redirect("/login");
      }
    );
  }
  // POST routes
  static POST(app: Application): void {
    Router.bookSearch(app);
    Router.userLogin(app);
    Router.employeeCreate(app);
    Router.employeeSearch(app);
    Router.bookCreate(app);
    Router.membershipCreate(app);
    Router.membershipSearch(app);
    Router.findMemberBooks(app);
  }

  private static bookSearch(app: Application): void {
    app.post(
      "/booksearch",
      Controller.bookSearch
    );
  }

  private static userLogin(app: Application): void {
    app.post(
      "/login",
      Guard.authenticate
    );
  }

  private static employeeCreate(app: Application): void {
    app.post(
      "/dashboard/employeecreate",
      Guard.forwardAdmin,
      Controller.employeeCreate
    );
  }

  private static employeeSearch(app: Application): void {
    app.post(
      "/dashboard/employeesearch",
      Guard.forwardAdmin,
      Controller.employeeSearch
    );
  }

  private static bookCreate(app: Application): void {
    app.post(
      "/dashboard/bookcreate",
      Guard.ensureAuthenticated,
      Controller.bookCreate
    );
  }

  private static membershipCreate(app: Application): void {
    app.post(
      "/dashboard/membershipcreate",
      Guard.ensureAuthenticated,
      Controller.membershipCreate
    );
  }

  private static membershipSearch(app: Application): void {
    app.post(
      "/dashboard/membershipSearch",
      Guard.ensureAuthenticated,
      Controller.membershipSearch
    );
  }

  private static findMemberBooks(app: Application): void {
    app.post(
      "/dashboard/findmemberbooks",
      Guard.ensureAuthenticated,
      Controller.findMemberBooks
    );
  }

  static PUT(app: Application): void {
    Router.employeeUpdate(app);
    Router.changePassword(app);
    Router.bookUpdate(app);
    Router.membershipUpdate(app);
    Router.updateMemberBooks(app)
  }

  private static employeeUpdate(app: Application): void {
    app.put(
      "/dashboard/employeeupdate",
      Guard.forwardAdmin,
      Controller.employeeUpdate
    );
  }

  private static changePassword(app: Application): void {
    app.put(
      "/dashboard/changepassword",
      Guard.ensureAuthenticated,
      Controller.changePassword
    );
  }

  private static bookUpdate(app: Application): void {
    app.put(
      "/dashboard/bookupdate",
      Guard.ensureAuthenticated,
      Controller.bookUpdate
    );
  }

  private static membershipUpdate(app: Application): void {
    app.put(
      "/dashboard/membershipupdate",
      Guard.ensureAuthenticated,
      Controller.membershipUpdate
    );
  }

  private static updateMemberBooks(app: Application): void {
    app.put(
      "/dashboard/updatememberbooks",
      Guard.ensureAuthenticated,
      Controller.updateMemberBooks
    );
  }

  static DELETE(app: Application): void {
    Router.employeeDelete(app);
    Router.bookDelete(app);
    Router.membershipDelete(app);
  }

  private static employeeDelete(app: Application): void {
    app.delete(
      "/dashboard/employedelete",
      Guard.forwardAdmin,
      Controller.employeeDelete
    );
  }

  private static bookDelete(app: Application): void {
    app.delete(
      "/dashboard/bookdelete",
      Guard.ensureAuthenticated,
      Controller.bookDelete
    );
  }

  private static membershipDelete(app: Application): void {
    app.delete(
      "/dashboard/membershipdelete",
      Guard.ensureAuthenticated,
      Controller.membershipDelete
    );
  }
}