import * as express from "express";
import Controller from "../controller/Controller";

export default class Router {
  static map(app: express.Application): void {
    Controller.adminInit();
    Controller.GET(app);
    Controller.POST(app);
  }
}