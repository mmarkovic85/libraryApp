import * as fs from "fs";
import { logObj } from "../customTypes/customTypes";

export default class Activity {
  private static logIt(logEntry: string): void {
    const logIt: string = new Date() + logEntry + "\n";
    fs.appendFile(
      './log/activityLog.txt',

      logIt,

      (err: object) => { if (err) throw err; }
    );
  }

  static log(logObj: logObj): void {
    let logEntry: string = "";

    logObj.userId && (logEntry += " -- " + logObj.userId);
    logObj.action && (logEntry += " -- " + logObj.action);
    logObj.type && (logEntry += " -- " + logObj.type);
    logObj.data && (logEntry += " -- " + JSON.stringify(logObj.data));
    logObj.message && (logEntry += " -- " + logObj.message);

    Activity.logIt(logEntry);
  }
}