import * as fs from "fs";
import { Application, Request, Response } from "express";
import Controller from "../controller/Controller";
import Guard from "../guard/Guard";
import { flashMsg, Book } from "../types/Types";

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
        res.end();
      }
    );
  }

  private static search(app: Application): void {
    app.get(
      "/search",
      (req: Request, res: Response): void => {

        res.render("search");
        res.end();
      }
    );
  }

  private static login(app: Application): void {
    app.get(
      "/login",
      Guard.forwardEmployee,
      (req: Request, res: Response): void => {

        res.render("login", {
          msg: req.flash("success").concat(
            req.flash("error")
          )
        });
        res.end();
      }
    );
  }

  private static dashboard(app: Application): void {
    app.get(
      "/dashboard",
      Guard.ensureAuthenticated,
      (req: Request, res: Response): void => {

        res.render(
          req.user.isAdmin ? "adminDash" : "employeeDash",
          { name: req.user.name }
        );
        res.end();
      }
    );
  }

  private static logout(app: Application): void {
    app.get(
      "/logout",
      (req: Request, res: Response): void => {

        req.logout();
        req.flash("success", "You have successfully logged out!")
        res.redirect("/login");
        res.end();
      }
    );
  }

  // POST routes
  static POST(app: Application): void {
    Router.userLogin(app);
    Router.activityLog(app);
    Router.findMemberBooks(app);
    Router.employeeCreate(app);
    Router.employeeSearch(app);
    Router.bookCreate(app);
    Router.bookSearch(app);
    Router.membershipCreate(app);
    Router.membershipSearch(app);
  }

  private static userLogin(app: Application): void {
    app.post(
      "/login",
      Guard.authenticate
    );
  }

  private static activityLog(app: Application): void {
    app.post(
      "/dashboard/activitylog",
      Guard.forwardAdmin,
      (req: Request, res: Response): void => {

        fs
          .createReadStream('./log/activityLog.txt')
          .pipe(res);
      }
    );
  }

  private static findMemberBooks(app: Application): void {
    app.post(
      "/dashboard/memberbookssearch",
      Guard.ensureAuthenticated,
      (req: Request, res: Response): void => {

        Controller
          .memberBooksSearch(req.body)
          .then((books: Book[]) => {

            res.json(JSON.stringify(books));
            res.end();
          });
      }
    );
  }

  private static employeeCreate(app: Application): void {
    app.post(
      "/dashboard/employeecreate",
      Guard.forwardAdmin,
      (req: Request, res: Response): void => {

        const {
          username, newpass1, newpass2,
          name, surname, email, isAdmin
        } = req.body;

        Controller
          .addEmployee({
            username,
            newpass1,
            newpass2,
            name,
            surname,
            email,
            isAdmin
          }, req.user._id)
          .then((msgs: flashMsg[]): void => {

            res.json(JSON.stringify(msgs));
            res.end();
          });
      }
    );
  }

  private static employeeSearch(app: Application): void {
    app.post(
      "/dashboard/employeesearch",
      Guard.forwardAdmin,
      (req: Request, res: Response): void => {

        Controller
          .employeeSearch(req.body)
          .then((employees: string) => {

            res.json(employees);
            res.end();
          });
      }
    );
  }

  private static bookCreate(app: Application): void {
    app.post(
      "/dashboard/bookcreate",
      Guard.ensureAuthenticated,
      (req: Request, res: Response): void => {

        const { author, title, year, language } = req.body;

        Controller
          .addBook({
            author,
            title,
            year,
            language,
            isAvailable: true
          }, req.user._id)
          .then((msgs: flashMsg[]): void => {

            res.json(JSON.stringify(msgs));
            res.end();
          });
      }
    );
  }

  private static bookSearch(app: Application): void {
    app.post(
      "/booksearch",
      (req: Request, res: Response): void => {

        Controller
          .bookSearch(req.body, !!req.user)
          .then((books: string): void => {

            res.json(books)
          });
      }
    );
  }

  private static membershipCreate(app: Application): void {
    app.post(
      "/dashboard/membershipcreate",
      Guard.ensureAuthenticated,
      (req: Request, res: Response): void => {

        const { name, surname, address, status } = req.body;

        Controller
          .addMembership({
            name,
            surname,
            address,
            status,
            books: []
          }, req.user._id)
          .then((msgs: flashMsg[]): void => {

            res.json(JSON.stringify(msgs));
            res.end();
          });
      }
    );
  }

  private static membershipSearch(app: Application): void {
    app.post(
      "/dashboard/membershipSearch",
      Guard.ensureAuthenticated,
      (req: Request, res: Response): void => {

        Controller
          .membershipSearch(req.body)
          .then((memberships: string) => {

            res.json(memberships);
            res.end();
          });
      }
    );
  }

  // PUT routes
  static PUT(app: Application): void {
    Router.changePassword(app);
    Router.updateMemberBooks(app);
    Router.employeeUpdate(app);
    Router.bookUpdate(app);
    Router.membershipUpdate(app);
  }

  private static changePassword(app: Application): void {
    app.put(
      "/dashboard/changepassword",
      Guard.ensureAuthenticated,
      (req: Request, res: Response): void => {

        const { newpass1, newpass2 } = req.body;
        const { _id } = req.user;

        Controller
          .setPassword({
            _id,
            newpass1,
            newpass2
          }, _id)
          .then((msgs: flashMsg[]): void => {

            res.json(JSON.stringify(msgs));
            res.end();
          });
      }
    );
  }

  private static updateMemberBooks(app: Application): void {
    app.put(
      "/dashboard/updatememberbooks",
      Guard.ensureAuthenticated,
      (req: Request, res: Response): void => {

        Controller
          .editMemberBooks(req.body, req.user._id)
          .then((msgs: flashMsg[]): void => {

            res.json(JSON.stringify(msgs));
            res.end();
          });
      }
    );
  }

  private static employeeUpdate(app: Application): void {
    app.put(
      "/dashboard/employeeupdate",
      Guard.forwardAdmin,
      (req: Request, res: Response): void => {

        Controller
          .setPassword(req.body, req.user._id)
          .then((msgs: flashMsg[]): void => {

            res.json(JSON.stringify(msgs));
            res.end();
          });
      }
    );
  }

  private static bookUpdate(app: Application): void {
    app.put(
      "/dashboard/bookupdate",
      Guard.ensureAuthenticated,
      (req: Request, res: Response): void => {

        Controller
          .editBook(req.body, req.user._id)
          .then((msgs: flashMsg[]): void => {

            res.json(JSON.stringify(msgs));
            res.end();
          });
      }
    );
  }

  private static membershipUpdate(app: Application): void {
    app.put(
      "/dashboard/membershipupdate",
      Guard.ensureAuthenticated,
      (req: Request, res: Response): void => {

        Controller
          .editMember(req.body, req.user._id)
          .then((msgs: flashMsg[]): void => {

            res.json(JSON.stringify(msgs));
            res.end();
          });
      }
    );
  }

  // DELETE routes
  static DELETE(app: Application): void {
    Router.employeeDelete(app);
    Router.bookDelete(app);
    Router.membershipDelete(app);
  }

  private static employeeDelete(app: Application): void {
    app.delete(
      "/dashboard/employedelete",
      Guard.forwardAdmin,
      (req: Request, res: Response): void => {

        Controller
          .employeeDelete({
            user_id: req.user._id,
            delete_id: req.body._id
          })
          .then((msgs: flashMsg[]): void => {

            res.json(JSON.stringify(msgs));
            res.end();
          });
      }
    );
  }

  private static bookDelete(app: Application): void {
    app.delete(
      "/dashboard/bookdelete",
      Guard.ensureAuthenticated,
      (req: Request, res: Response): void => {

        Controller
          .bookDelete({
            user_id: req.user._id,
            delete_id: req.body._id,
            isAvailable: req.body.isAvailable
          })
          .then((msgs: flashMsg[]): void => {

            res.json(JSON.stringify(msgs));
            res.end();
          });
      }
    );
  }

  private static membershipDelete(app: Application): void {
    app.delete(
      "/dashboard/membershipdelete",
      Guard.ensureAuthenticated,
      (req: Request, res: Response): void => {

        Controller
          .memberDelete({
            user_id: req.user._id,
            delete_id: req.body._id
          })
          .then((msgs: flashMsg[]): void => {

            res.json(JSON.stringify(msgs));
            res.end();
          });
      }
    );
  }

  static error404(app: Application): void {
    app.use((req: Request, res: Response): void => {
      res.status(404);

      // respond html
      req.accepts('html') && res.render('404', { url: req.url });

      // respond json
      req.accepts('json') && res.send(JSON.stringify(
        { error: 'Not found' }
      ));

      // default respond text
      res.type('txt').send('Not found');


      res.end();
    });
  }
}