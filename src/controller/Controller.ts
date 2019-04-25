import * as fs from "fs";
import * as path from "path";
import { Application, Request, Response } from "express";
import Db from "../database/Db";
import Guard from "../guard/Guard";
import Router from "../router/Router";
import { flashMsg, Employee, ConfigObj, EmployeeQuery } from "../customTypes/customTypes";

export default class Controller {
  static map(app: Application): void {
    Controller.admin();
    Guard.config();
    Router.GET(app);
    Router.POST(app);
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
      .catch(err => console.log(err));
  }
  // Read app config json
  static appConfig(): ConfigObj {
    const config: ConfigObj = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../../", "appconfig.json"),
        "utf8"
      )
    );
    return config;
  }
  // Employee search
  static async findEmployee(employee: EmployeeQuery): Promise<Employee> {
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
}