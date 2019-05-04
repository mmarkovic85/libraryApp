import * as fs from "fs";
import { Application, Request, Response } from "express";
import Controller from "../controller/Controller";
import Guard from "../guard/Guard";
import { flashMsg, Book } from "../types/Types";

export default class Router {
  // GET routes
  static GET(server: Application): void {
    Router.homepage(server);
    Router.search(server);
    Router.login(server);
    Router.dashboard(server);
    Router.logout(server);
  }

  private static homepage(server: Application): void {
    server.get(
      "/",
      (req: Request, res: Response): void => {

        res.render("index");
        res.end();
      }
    );
  }

  private static search(server: Application): void {
    server.get(
      "/search",
      (req: Request, res: Response): void => {

        res.render("search");
        res.end();
      }
    );
  }

  private static login(server: Application): void {
    server.get(
      "/login",
      Guard.forwardEmployee,
      (req: Request, res: Response): void => {

        res.render("login", {
          suc: req.flash("success"),
          err: req.flash("error")
        });
        res.end();
      }
    );
  }

  private static dashboard(server: Application): void {
    server.get(
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

  private static logout(server: Application): void {
    server.get(
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
  static POST(server: Application): void {
    Router.userLogin(server);
    Router.activityLog(server);
    Router.findMemberBooks(server);
    Router.employeeCreate(server);
    Router.employeeSearch(server);
    Router.bookCreate(server);
    Router.bookSearch(server);
    Router.membershipCreate(server);
    Router.membershipSearch(server);
  }

  private static userLogin(server: Application): void {
    server.post(
      "/login",
      Guard.authenticate
    );
  }

  private static activityLog(server: Application): void {
    server.post(
      "/dashboard/activitylog",
      Guard.forwardAdmin,
      (req: Request, res: Response): void => {

        fs
          .createReadStream('./log/activityLog.txt')
          .pipe(res);
      }
    );
  }

  private static findMemberBooks(server: Application): void {
    server.post(
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

  private static employeeCreate(server: Application): void {
    server.post(
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

  private static employeeSearch(server: Application): void {
    server.post(
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

  private static bookCreate(server: Application): void {
    server.post(
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

  private static bookSearch(server: Application): void {
    server.post(
      "/booksearch",
      (req: Request, res: Response): void => {

        Controller
          .bookSearch(req.body, !!req.user)
          .then((books: string): void => {

            res.json(books);
            res.end();
          });
      }
    );
  }

  private static membershipCreate(server: Application): void {
    server.post(
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

  private static membershipSearch(server: Application): void {
    server.post(
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
  static PUT(server: Application): void {
    Router.changePassword(server);
    Router.updateMemberBooks(server);
    Router.employeeUpdate(server);
    Router.bookUpdate(server);
    Router.membershipUpdate(server);
  }

  private static changePassword(server: Application): void {
    server.put(
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

  private static updateMemberBooks(server: Application): void {
    server.put(
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

  private static employeeUpdate(server: Application): void {
    server.put(
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

  private static bookUpdate(server: Application): void {
    server.put(
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

  private static membershipUpdate(server: Application): void {
    server.put(
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
  static DELETE(server: Application): void {
    Router.employeeDelete(server);
    Router.bookDelete(server);
    Router.membershipDelete(server);
  }

  private static employeeDelete(server: Application): void {
    server.delete(
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

  private static bookDelete(server: Application): void {
    server.delete(
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

  private static membershipDelete(server: Application): void {
    server.delete(
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

  static error404(server: Application): void {
    server.use((req: Request, res: Response): void => {
      res.status(404);

      // respond html
      req.accepts('html') ?
        res.render('404', { url: req.url }) :
        // respond json
        req.accepts('json') ?
          res.send(JSON.stringify(
            { error: 'Not found' }
          )) :
          // default respond text
          res.type('txt').send('Not found');

      res.end();
    });
  }
}