import { Employee, flashMsg } from "../customTypes/customTypes";

export default class Validate {
  static employee(newEmployee: Employee): flashMsg[] {
    const { username,
      newpass1,
      newpass2,
      name,
      surname,
      email } = newEmployee;
    const errors: flashMsg[] = [];

    // Username
    const test = new RegExp(
      "^" +
      name.charAt(0).toLowerCase() +
      surname.charAt(0).toLowerCase() +
      surname.charAt(1) +
      surname.charAt(2) +
      "\\d{6}$"
    );
    (test).test(username) || errors.push({
      type: "error",
      message: "Invalid username input!"
    });
    // Password
    (/^([A-Z|a-z]){1}\w{6,19}([A-Z|a-z]|[0-9]){1}$/)
      .test(newpass1) || errors.push({
        type: "error",
        message: "Invalid password input!"
      });
    // Password confirmation
    newpass1 === newpass2 || errors.push({
      type: "error",
      message: "Passwords don't match!"
    });
    // Name
    (/^([A-Z]|[ČĆŠĐŽ]){1}([a-z]|[čćšđž]){2,19}$/)
      .test(name) || errors.push({
        type: "error",
        message: "Invalid name input!"
      });
    // Surname
    (/^([A-Z]|[ČĆŠĐŽ]){1}([a-z]|[čćšđž]){2,19}$/)
      .test(surname) || errors.push({
        type: "error",
        message: "Invalid surname input!"
      });
    // E-mail
    (/^([a-z]){1}\w|[.-_]{1,}@([a-z]|[0-9]){1,}[.]([a-z]|[0-9]){2,5}$/)
      .test(email) || errors.push({
        type: "error",
        message: "Invalid e-mail input!"
      });

    return errors;
  }
}