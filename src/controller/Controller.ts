import * as fs from "fs";
import * as path from "path";
import { Application, Request, Response } from "express";
import Db from "../database/Db";
import Guard from "../guard/Guard";
import Router from "../router/Router";
import { Employee, ConfigObj, EmployeeQuery } from "../customTypes/customTypes";

export default class Controller {
  static map(app: Application): void {
    Controller.admin();
    Guard.config();
    Router.GET(app);
    Router.POST(app);
  }
  // Default admin check
  private static admin(): void {
    Db
      .find({ username: "admin" }, "libraryEmployees")
      .then((dbRes: string): void => {
        JSON.parse(dbRes).length || Controller.defaultAdmin();
      });
  }
  private static defaultAdmin(): void {
    let { username, password } = Controller.appConfig("admin");

    Guard
      .generateHash(password)
      .then((hash: string): void => {
        const admin: Employee = {
          username,
          password: hash
        };

        Db.insertOne(admin, "libraryEmployees");
      })
      .catch(err => console.log(err));
  }
  // Read app config json
  static appConfig(option: string): ConfigObj {
    const config: string = fs.readFileSync(
      path.join(__dirname, "../../", "appconfig.json"),
      "utf8"
    );
    let res: ConfigObj;

    switch (option) {
      case "db":
        res = JSON.parse(config).db;
        break;
      case "admin":
        res = JSON.parse(config).defaultAdmin;
        break;
    }

    return res;
  }
  // Book search API
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
    // Db query and response
    query.length
      ?
      Db
        .find({ $and: query }, "libraryBooks")
        .then((dbRes: string) => res.json(dbRes))
        .catch(err => console.log(err))
      :
      res.json("[]");
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
}