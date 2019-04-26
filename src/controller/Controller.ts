import * as fs from "fs";
import * as path from "path";
import { Application, Request, Response } from "express";
import Db from "../database/Db";
import Guard from "../guard/Guard";
import Router from "../router/Router";
import { flashMsg, Employee, ConfigObj } from "../customTypes/customTypes";
import Validate from "../validate/Validate";

export default class Controller {
  static map(app: Application): void {
    Controller.admin();
    Guard.config();
    Router.GET(app);
    Router.POST(app);
  }
  // Default admin check
  private static admin(): void {
    const { username, password, email } = Controller.appConfig().defaultAdmin;

    Controller
      .findEmployee({ username })
      .then((user: Employee): void => {
        user || Controller.defaultAdmin({ username, password, email });
      });
  }

  private static defaultAdmin({ username, password, email }): void {
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
      .catch(err => console.log(err));
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
      res = JSON.parse(
        await Db.findOne(
          employee,
          "libraryEmployees"
        )
      );
    } catch (err) {
      if (err) console.log(err);
    }

    return res;
  }

  // Router callbacks

  static dashboard(req: Request, res: Response): void {
    req.user.isAdmin ?
      res.render("adminDash", { name: req.user.username }) :
      res.render("employeeDash", { name: req.user.username });
  }

  static bookSearch(req: Request, res: Response): void {
    const { author, title, year, language } = req.body;
    let query: object[] = [];
    // Weed out empty search fields
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

    query.length ?
      Db
        .find({ $and: query }, "libraryBooks")
        .then((dbRes: string) => res.json(dbRes))
        .catch(err => console.log(err)) :
      req.user ?
        Db
          .find({}, "libraryBooks")
          .then((dbRes: string) => res.json(dbRes))
          .catch(err => console.log(err)) :
        res.json("[]");
  }

  static employeeCreate(req: Request, res: Response): void {
    const { username, name, surname, email, isAdmin } = req.body;
    // Validate input
    let msg: flashMsg[] = Validate.employee(req.body);
    // If no errors found
    msg.length === 0 ?
      // Check email and username ind database
      Controller
        .findEmployee({ $or: [{ username }, { email }] })
        .then((found: Employee): void => {
          !found ?
            // User not found
            Guard
              .generateHash(req.body.newpass1)
              .then((hash: string): void => {

                const permission: boolean =
                  isAdmin === "true" ?
                    true :
                    false;

                Db
                  .insertOne(
                    {
                      username,
                      password: hash,
                      name,
                      surname,
                      email,
                      isAdmin: permission
                    },
                    "libraryEmployees"
                  )
                  .then((dbRes: boolean): void => {
                    if (dbRes) res.json(JSON.stringify([{
                      type: "success",
                      message: "Employee successfully saved!"
                    }]));
                  })
                  .catch(err => console.log(err));
              })
              .catch(err => console.log(err)) :
            // User exist
            res.json(JSON.stringify([{
              type: "error",
              message: "Username or email already exists!"
            }]));
        })
        .catch(err => console.log(err)) :
      res.json(JSON.stringify(msg));
  }
}