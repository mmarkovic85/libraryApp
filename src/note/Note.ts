import { flashMsg } from "../types/Types";

export default class Note {
  static error(msg: string): flashMsg {
    return {
      type: "error",
      message: msg
    };
  }
  
  static success(msg: string): flashMsg {
    return {
      type: "success",
      message: msg
    };
  }
}