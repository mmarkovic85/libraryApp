import { Employee, flashMsg, Book } from "../customTypes/customTypes";

export default class Validate {
  static employeeInput(newEmployee: Employee): flashMsg[] {
    const { username,
      newpass1,
      newpass2,
      name,
      surname,
      email } = newEmployee;
    const errors: flashMsg[] = [];

    // Username
    Validate.username({ username, name, surname }) || errors.push({
      type: "error",
      message: "Invalid username input!"
    });
    // Password
    Validate.password(newpass1) || errors.push({
      type: "error",
      message: "Invalid password input!"
    });
    // Password confirmation
    newpass1 === newpass2 || errors.push({
      type: "error",
      message: "Passwords don't match!"
    });
    // Name
    Validate.personalName(name) || errors.push({
      type: "error",
      message: "Invalid name input!"
    });
    // Surname
    Validate.surname(surname) || errors.push({
      type: "error",
      message: "Invalid surname input!"
    });
    // E-mail
    Validate.email(email) || errors.push({
      type: "error",
      message: "Invalid e-mail input!"
    });

    return errors;
  }

  private static username({ username, name, surname }): boolean {
    return (new RegExp(
      "^" +
      name.charAt(0).toLowerCase() +
      name.charAt(1) +
      name.charAt(2) +
      surname.charAt(0).toLowerCase() +
      surname.charAt(1) +
      surname.charAt(2) +
      "$"
    )).test(username);
  }

  private static password(pass: string): boolean {
    return (/^([A-Z|a-z]){1}\w{6,19}([A-Z|a-z]|[0-9]){1}$/).test(pass);
  }

  private static personalName(name: string): boolean {
    return (/^([A-Z]|[ČĆŠĐŽ]){1}([a-z]|[čćšđž]){2,19}$/).test(name);
  }

  private static surname(surname: string): boolean {
    return (/^([A-Z]|[ČĆŠĐŽ]){1}([a-z]|[čćšđž]){2,19}$/).test(surname);
  }

  private static email(email: string): boolean {
    return (/^([a-z]){1}\w|[.-_]{1,}@([a-z]|[0-9]){1,}[.]([a-z]|[0-9]){2,5}$/)
      .test(email);
  }

  static passwordInput(employee: Employee): flashMsg[] {
    const {
      newpass1,
      newpass2
    } = employee;
    const errors: flashMsg[] = [];

    // Password
    Validate.password(newpass1) || errors.push({
      type: "error",
      message: "Invalid password input!"
    });
    // Password confirmation
    newpass1 === newpass2 || errors.push({
      type: "error",
      message: "Passwords don't match!"
    });

    return errors;
  }

  static bookInput(book: Book): flashMsg[] {
    const errors: flashMsg[] = [];

    return errors
  }
}