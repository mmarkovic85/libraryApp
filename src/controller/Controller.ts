import * as fs from "fs";
import * as path from "path";
import { Application, Request, Response } from "express";
import Db from "../database/Db";
import Guard from "../guard/Guard";
import Router from "../router/Router";
import { flashMsg, Employee, Book, ConfigObj, DocumentQuery } from "../customTypes/customTypes";
import Validate from "../validate/Validate";

export default class Controller {
  static map(app: Application): void {
    Controller.admin();
    Guard.config();
    Router.GET(app);
    Router.POST(app);
    Router.PUT(app);
    Router.DELETE(app);
  }
  // Default admin check
  private static admin(): void {
    const { username, password } = Controller.appConfig().defaultAdmin;

    Controller
      .findEmployee({ username })
      .then((user: Employee): void => {
        user || Controller.defaultAdmin({ username, password });
      });
  }

  private static defaultAdmin({ username, password }): void {
    Guard
      .generateHash(password)
      .then((hash: string): void => {
        const admin: Employee = {
          username,
          password: hash,
          isAdmin: true
        };

        Db.insertOne(admin, "libraryEmployees");
      })
      .catch((err: Error) => console.log(err));
  }
  // Read/write app config json
  static appConfig(configUpdate?: ConfigObj): ConfigObj | undefined {
    let config: ConfigObj;

    configUpdate ?
      fs.writeFileSync(
        path.join(__dirname, "../../", "appconfig.json"),
        JSON.stringify(configUpdate),
        "utf8",
      )
      :
      config = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "../../", "appconfig.json"),
          "utf8"
        )
      );

    return config;
  }
  // Employee search
  static async findEmployee(employee: object): Promise<Employee> {
    let res: Employee;

    try {
      res =
        await Db.findOne(
          employee,
          "libraryEmployees"
        );
    } catch (err) {
      if (err) console.log(err);
    }

    return res;
  }

  static filterInput(searchParams: Employee & Book, isEmployee: boolean = true): object {
    const { author,
      title,
      year,
      language,
      username,
      name,
      surname,
      email } = searchParams;
    let inputs: object[] = [];

    // Weed out empty search fields
    author && inputs.push({
      author: { $regex: new RegExp(author, "i") }
    });
    title && inputs.push({
      title: { $regex: new RegExp(title, "i") }
    });
    year && inputs.push({
      year: { $regex: new RegExp(year, "i") }
    });
    language && inputs.push({
      language: { $regex: new RegExp(language, "i") }
    });
    username && inputs.push({
      username: { $regex: new RegExp(username, "i") }
    });
    name && inputs.push({
      name: { $regex: new RegExp(name, "i") }
    });
    surname && inputs.push({
      surname: { $regex: new RegExp(surname, "i") }
    });
    email && inputs.push({
      email: { $regex: new RegExp(email, "i") }
    });

    return inputs.length ?
      { $and: inputs } :
      isEmployee ?
        {} :
        null;
  }

  // Add new employee

  private static async addEmployee(doc: Employee): Promise<flashMsg[]> {
    const { username, newpass1, name, surname, email, isAdmin } = doc;
    // Validate input
    const msgs: flashMsg[] = Validate.employeeInput(doc);
    // If no errors found
    if (msgs.length === 0) {
      try {

        if (await Controller.findEmployee({ $or: [{ username }, { email }] })) {
          msgs.push({
            type: "error",
            message: "Username or email already exists!"
          });
        } else {
          await Db
            .insertOne(
              {
                username,
                password: await Guard.generateHash(newpass1),
                name,
                surname,
                email,
                isAdmin
              },
              "libraryEmployees"
            ) ?
            msgs.push({
              type: "success",
              message: "Employee successfully saved!"
            }) :
            msgs.push({
              type: "error",
              message: "Database error!"
            })
        }
      } catch (err) {
        if (err) console.log(err);
      }
    }

    return msgs;
  }

  // Employee password change

  private static async setPassword(doc: Employee): Promise<flashMsg[]> {
    const { _id, newpass1 } = doc

    const msgs: flashMsg[] = Validate.passwordInput(doc);

    if (msgs.length === 0) {
      try {
        const hash: string = await Guard.generateHash(newpass1);
        const updateData: DocumentQuery = {
          _id,
          document: {
            password: hash
          }
        };
        return await Db.updateOne(updateData, "libraryEmployees") ?
          [{
            type: "success",
            message: "Password successfully updated!"
          }] :
          [{
            type: "error",
            message: "Password was not updated!"
          }];
      } catch (err) {
        if (err) console.log(err);
      }
    } else {
      return msgs;
    }
  }

  // Add new book

  private static async addBook(doc: Book): Promise<flashMsg[]> {
    // Validate input
    const msgs: flashMsg[] = Validate.bookInput(doc);
    // If no errors found
    if (msgs.length === 0) {
      try {
        await Db
          .insertOne(doc, "libraryBooks") ?
          msgs.push({
            type: "success",
            message: "Book successfully saved!"
          }) :
          msgs.push({
            type: "error",
            message: "Database error!"
          });
      } catch (err) {
        if (err) console.log(err)
      }
    }

    return msgs;
  }

  private static async editBook(doc: Book): Promise<flashMsg[]> {
    const { _id, author, title, year, language } = doc;
    // Validate input
    const msgs: flashMsg[] = Validate.bookInput(doc);

    if (msgs.length === 0) {
      try {
        const updateData: DocumentQuery = {
          _id,
          document: {
            author,
            title,
            year,
            language
          }
        }
        await Db
          .updateOne(updateData, "libraryBooks") ?
          msgs.push({
            type: "success",
            message: "Book successfully edited!"
          }) :
          msgs.push({
            type: "error",
            message: "Book was not updated!"
          });
      } catch (err) {
        if (err) console.log(err)
      }
    }

    return msgs;
  }

  // Router callbacks

  static dashboard(req: Request, res: Response): void {

    res.render(
      req.user.isAdmin ? "adminDash" : "employeeDash",
      { name: req.user.username }
    );
  }

  static bookSearch(req: Request, res: Response): void {
    const query: object = Controller.filterInput(req.body, !!req.user);

    query ?
      Db
        .find(query, "libraryBooks")
        .then((dbRes: Book[]) => res.json(JSON.stringify(dbRes)))
        .catch((err: Error) => console.log(err)) :
      res.json("[]");
  }

  static employeeCreate(req: Request, res: Response): void {
    const { username, newpass1, newpass2, name, surname, email, isAdmin } = req.body;
    Controller
      .addEmployee({
        username,
        newpass1,
        newpass2,
        name,
        surname,
        email,
        isAdmin: isAdmin === "true" ? true : false
      })
      .then((msgs: flashMsg[]) => {
        res.json(JSON.stringify(msgs));
      })
      .catch((err: Error) => console.log(err));

  }

  static employeeSearch(req: Request, res: Response): void {
    const query: object = Controller.filterInput(req.body);

    query ?
      Db
        .find(query, "libraryEmployees")
        .then((dbRes: Employee[]) => res.json(JSON.stringify(
          // omit password hash from response
          dbRes.map((e: Employee): Employee => {
            return {
              _id: e._id,
              username: e.username,
              name: e.name,
              surname: e.surname,
              email: e.email
            }
          })
        )))
        .catch((err: Error) => console.log(err)) :
      res.json("[]");

  }

  static employeeUpdate(req: Request, res: Response): void {
    Controller
      .setPassword(req.body)
      .then((msgs: flashMsg[]): void => {
        res.json(JSON.stringify(msgs));
      })
      .catch((err: Error) => console.log(err));
  }

  static employeeDelete(req: Request, res: Response): void {
    req.body._id == req.user._id ?
      res.json(JSON.stringify([{
        type: "error",
        message: "Cannot delete account in use!"
      }])) :
      Db
        .deleteOne(req.body, "libraryEmployees")
        .then((dbRes: boolean): void => {
          const msg: flashMsg = dbRes ?
            {
              type: "success",
              message: "Employee successfully deleted!"
            } :
            {
              type: "error",
              message: "Employee was not deleted!"
            };

          res.json(JSON.stringify([msg]));
        })
        .catch((err: Error) => console.log(err));
  }

  static changePassword(req: Request, res: Response): void {
    const { newpass1, newpass2 } = req.body;
    const { _id } = req.user;
    Controller
      .setPassword({
        _id,
        newpass1,
        newpass2
      })
      .then((msgs: flashMsg[]): void => {
        res.json(JSON.stringify(msgs));
      })
      .catch((err: Error) => console.log(err));
  }

  static bookCreate(req: Request, res: Response): void {
    const { author, title, year, language } = req.body;
    Controller
      .addBook({
        author,
        title,
        year,
        language,
        isAvailable: true
      })
      .then((msgs: flashMsg[]) => {
        res.json(JSON.stringify(msgs));
      })
      .catch((err: Error) => console.log(err));
  }

  static bookUpdate(req: Request, res: Response): void {
    Controller
      .editBook(req.body)
      .then((msgs: flashMsg[]) => {
        res.json(JSON.stringify(msgs));
      })
      .catch((err: Error) => console.log(err));
  }

  static bookDelete(req: Request, res: Response): void {
    req.body.isAvailable === "true" ?

      Db
        .deleteOne(req.body, "libraryBooks")
        .then((dbRes: boolean): void => {
          const msg: flashMsg = dbRes ?
            {
              type: "success",
              message: "Book successfully deleted!"
            } :
            {
              type: "error",
              message: "Book was not deleted!"
            };

          res.json(JSON.stringify([msg]));
        })
        .catch((err: Error) => console.log(err)) :

      res.json(JSON.stringify([{
        type: "error",
        message: "Cannot delete borrowed book!"
      }]));
  }
}