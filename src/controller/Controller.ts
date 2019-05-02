import * as fs from "fs";
import * as path from "path";
import { Application, Request, Response } from "express";
import Db from "../database/Db";
import Guard from "../guard/Guard";
import Router from "../router/Router";
import Validate from "../validate/Validate";
import Activity from "../activity/Activity";
import {
  flashMsg,
  Employee,
  Book,
  Membership,
  ConfigObj,
  DocumentQuery
} from "../customTypes/customTypes";

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
      .findOne({ username }, "libraryEmployees")
      .then((user: Employee): void => {
        user || Controller.defaultAdmin({ username, password });
      });
  }

  private static defaultAdmin({ username, password }): void {
    Guard
      .generateHash(password)
      .then((hash: string): void => {
        const admin: object = {
          username,
          password: hash,
          isAdmin: true
        };
        Db.insertOne({
          doc: admin,
          collName: "libraryEmployees",
          id: "server start up"
        });
      })
      .catch((err: Error): void => console.log(err));
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
  static async findOne(document: object | Book, collection: string): Promise<Employee | Book> {
    let res: Employee | Book;

    try {
      res =
        await Db.findOne(
          document,
          collection
        );
    } catch (err) {
      if (err) console.log(err);
    }

    return res;
  }

  static filterInput(searchParams: Employee & Book & Membership, isEmployee: boolean = true): object {
    const {
      author,
      title,
      year,
      language,
      username,
      name,
      surname,
      email,
      address,
      status
    } = searchParams;
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
    address && inputs.push({
      address: { $regex: new RegExp(address, "i") }
    });
    status && inputs.push({
      status: { $regex: new RegExp(status, "i") }
    });

    return inputs.length ?
      { $and: inputs } :
      isEmployee ?
        {} :
        null;
  }

  private static async addEmployee(doc: Employee, id: string): Promise<flashMsg[]> {
    const { username, newpass1, name, surname, email, isAdmin } = doc;
    // Validate input
    const msgs: flashMsg[] = Validate.employeeInput(doc);
    // If no errors found
    if (msgs.length === 0) {
      try {

        if (await Controller.findOne({ $or: [{ username }, { email }] }, "libraryEmployees")) {
          msgs.push({
            type: "error",
            message: "Username or email already exists!"
          });
        } else {
          await Db
            .insertOne(
              {
                doc: {
                  username,
                  password: await Guard.generateHash(newpass1),
                  name,
                  surname,
                  email,
                  isAdmin
                },
                collName: "libraryEmployees",
                id
              }) ?
            msgs.push({
              type: "success",
              message: "Employee successfully saved!"
            }) :
            msgs.push({
              type: "error",
              message: "Database error!"
            });
        }
      } catch (err) {
        if (err) console.log(err);
      }
    }

    return msgs;
  }

  // Employee password change

  private static async setPassword(doc: Employee, id: string): Promise<flashMsg[]> {
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

        const isUpdated: boolean = await Db.updateOne(updateData, "libraryEmployees");

        isUpdated && Activity.log({
          userId: id,
          type: "password",
          action: "change",
          data: id === _id ?
            null :
            { _id }
        });

        return isUpdated ?
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

  private static async addBook(doc: Book, id: string): Promise<flashMsg[]> {
    // Validate input
    const msgs: flashMsg[] = Validate.bookInput(doc);
    // If no errors found
    if (msgs.length === 0) {
      try {
        await Db
          .insertOne({
            doc,
            collName: "libraryBooks",
            id
          }) ?
          msgs.push({
            type: "success",
            message: "Book successfully saved!"
          }) :
          msgs.push({
            type: "error",
            message: "Book was not saved!"
          });
      } catch (err) {
        if (err) console.log(err)
      }
    }

    return msgs;
  }

  private static async editBook(doc: Book, id: string): Promise<flashMsg[]> {
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

        const isUpdated: boolean = await Db.updateOne(updateData, "libraryBooks");

        isUpdated && Activity.log({
          userId: id,
          type: "book",
          action: "edit",
          data: doc
        })

        isUpdated ?
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

  private static async addMembership(doc: Membership, id: string): Promise<flashMsg[]> {
    // Validate input
    const msgs: flashMsg[] = Validate.membershipInput(doc);
    // If no errors found
    if (msgs.length === 0) {
      try {
        await Db
          .insertOne({
            doc,
            collName: "libraryMemberships",
            id
          }) ?
          msgs.push({
            type: "success",
            message: "Membership successfully saved!"
          }) :
          msgs.push({
            type: "error",
            message: "Membership was not saved!"
          });
      } catch (err) {
        if (err) console.log(err)
      }
    }

    return msgs;
  }

  private static async editMember(doc: Membership, id: string): Promise<flashMsg[]> {
    const { _id, name, surname, address, status } = doc;
    // Validate input
    const msgs: flashMsg[] = Validate.membershipInput(doc);

    if (msgs.length === 0) {
      try {
        const updateData: DocumentQuery = {
          _id,
          document: {
            name,
            surname,
            address,
            status
          }
        }

        const isUpdated: boolean = await Db.updateOne(updateData, "libraryMemberships")

        isUpdated && Activity.log({
          userId: id,
          type: "member",
          action: "edit",
          data: doc
        })

        isUpdated ?
          msgs.push({
            type: "success",
            message: "Member successfully edited!"
          }) :
          msgs.push({
            type: "error",
            message: "Member was not updated!"
          });
      } catch (err) {
        if (err) console.log(err)
      }
    }

    return msgs;
  }

  private static async delMember(doc: Membership, id: string): Promise<flashMsg[]> {
    const { _id } = doc;
    let msgs: flashMsg[] = [];

    (await Db.findOne({ _id }, "libraryMemberships"))
      .books.length > 0 ?

      msgs.push({
        type: "error",
        message: "Can't delete member who currently have landed books!"
      }) :

      await Db.deleteOne({
        doc,
        collName: "libraryMemberships",
        id
      }) ?

        msgs.push({
          type: "success",
          message: "Member successfully deleted!"
        }) :

        msgs.push({
          type: "error",
          message: "Member was not deleted!"
        });

    return msgs;
  }

  // Router callbacks

  static dashboard(req: Request, res: Response): void {
    res.render(
      req.user.isAdmin ? "adminDash" : "employeeDash",
      { name: req.user.name }
    );
  }

  static bookSearch(req: Request, res: Response): void {
    const query: object = Controller.filterInput(
      req.body,
      !!req.user
    );

    query ?
      Db
        .find(query, "libraryBooks")
        .then((dbRes: Book[]): void => {
          res.json(JSON.stringify(dbRes))
        })
        .catch((err: Error): void => console.log(err)) :
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
        isAdmin
      }, req.user._id)
      .then((msgs: flashMsg[]): void => {
        res.json(JSON.stringify(msgs));
      })
      .catch((err: Error): void => console.log(err));

  }

  static employeeSearch(req: Request, res: Response): void {
    const query: object = Controller.filterInput(req.body);

    query ?
      Db
        .find(query, "libraryEmployees")
        .then((dbRes: Employee[]): void => {
          res.json(JSON.stringify(
            // omit password hash from response
            dbRes.map((e: Employee): Employee => {
              const { _id, username, name, surname, email, isAdmin } = e;
              return { _id, username, name, surname, email, isAdmin }
            })
          ))
        })
        .catch((err: Error): void => console.log(err)) :
      res.json("[]");

  }

  static employeeUpdate(req: Request, res: Response): void {
    Controller
      .setPassword(req.body, req.user._id)
      .then((msgs: flashMsg[]): void => {
        res.json(JSON.stringify(msgs));
      })
      .catch((err: Error): void => console.log(err));
  }

  static employeeDelete(req: Request, res: Response): void {
    req.body._id == req.user._id ?
      res.json(JSON.stringify([{
        type: "error",
        message: "Cannot delete account in use!"
      }])) :
      Db
        .deleteOne({
          doc: req.body,
          collName: "libraryEmployees",
          id: req.user._id
        })
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
        .catch((err: Error): void => console.log(err));
  }

  static changePassword(req: Request, res: Response): void {
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
      })
      .catch((err: Error): void => console.log(err));
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
      }, req.user._id)
      .then((msgs: flashMsg[]): void => {
        res.json(JSON.stringify(msgs));
      })
      .catch((err: Error): void => console.log(err));
  }

  static bookUpdate(req: Request, res: Response): void {
    Controller
      .editBook(req.body, req.user._id)
      .then((msgs: flashMsg[]): void => {
        res.json(JSON.stringify(msgs));
      })
      .catch((err: Error): void => console.log(err));
  }

  static bookDelete(req: Request, res: Response): void {
    req.body.isAvailable ?

      Db
        .deleteOne({
          doc: req.body,
          collName: "libraryBooks",
          id: req.user._id
        })
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
        .catch((err: Error): void => console.log(err)) :

      res.json(JSON.stringify([{
        type: "error",
        message: "Cannot delete borrowed book!"
      }]));
  }

  static membershipCreate(req: Request, res: Response): void {
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
      })
      .catch((err: Error): void => console.log(err));
  }

  static membershipSearch(req: Request, res: Response): void {
    const query: object = Controller.filterInput(req.body);

    query ?
      Db
        .find(query, "libraryMemberships")
        .then((dbRes: Membership[]): void => {
          res.json(JSON.stringify(dbRes))
        })
        .catch((err: Error): void => console.log(err)) :
      res.json("[]");

  }

  static membershipUpdate(req: Request, res: Response): void {
    Controller
      .editMember(req.body, req.user._id)
      .then((msgs: flashMsg[]): void => {
        res.json(JSON.stringify(msgs));
      })
      .catch((err: Error): void => console.log(err));
  }

  static membershipDelete(req: Request, res: Response): void {
    Controller
      .delMember(req.body, req.user._id)
      .then((msgs: flashMsg[]): void => {
        res.json(JSON.stringify(msgs));
      })
      .catch((err: Error): void => console.log(err));
  }

  static findMemberBooks(req: Request, res: Response): void {
    Controller
      .memBk(req.body)
      .then((books: Book[]) => {
        res.json(JSON.stringify(books));
      });
  }

  private static async memBk(temp: string[]): Promise<Book[]> {
    const res: Book[] = [];

    for (let i = 0; i < temp.length; i++) {
      res.push(
        await Db.findOne({ _id: temp[i] }, "libraryBooks")
      );
    }

    return res;
  }

  static updateMemberBooks(req: Request, res: Response): void {
    Controller
      .updMemBk(req.body, req.user._id)
      .then((dbRes: flashMsg[]): void => {
        res.json(JSON.stringify(dbRes));
      });
  }

  private static async updMemBk(doc: Membership, id: string): Promise<flashMsg[]> {
    const { _id, books, returned } = doc;
    // update member
    await Db.updateOne({ _id, document: { books } }, "libraryMemberships");
    // update books
    for (let i = 0; i < books.length; i++) {
      await Db.updateOne({
        _id: books[i], document: { isAvailable: false }
      }, "libraryBooks");
    }
    books.length > 0 && Activity.log({
      userId: id,
      type: "book",
      action: "lended",
      data: {
        _id,
        books
      }
    });
    for (let i = 0; i < returned.length; i++) {
      await Db.updateOne({
        _id: returned[i], document: { isAvailable: true }
      }, "libraryBooks");
    }
    returned.length > 0 && Activity.log({
      userId: id,
      type: "book",
      action: "returned",
      data: {
        _id,
        returned
      }
    });

    return [{
      type: "success",
      message: "member updated"
    }];
  }

  static activityLog(req: Request, res: Response): void {
    fs
      .createReadStream('./log/activityLog.txt')
      .pipe(res);
  }
}