import * as fs from "fs";
import { logObj } from "../types/Types";

export default class Activity {
  private static logAppend(logEntry: string): void {
    const logAddition: string = new Date() + logEntry + "\n";
    fs.appendFile(
      "./log/activityLog.txt",

      logAddition,

      (err: object) => { if (err) throw err; }
    );
  }

  static log(logObj: logObj): void {
    let logEntry: string = "";

    logObj.userId && (logEntry += " -- " + logObj.userId);
    logObj.action && (logEntry += " -- " + logObj.action);
    logObj.type && (logEntry += " -- " + logObj.type);
    logObj.data && (
      logEntry += (" -- ").concat(
        JSON.stringify(logObj.data).replace(/"/g, " ")
      )
    );
    logObj.message && (logEntry += " -- " + logObj.message);

    Activity.logAppend(logEntry);
  }
}