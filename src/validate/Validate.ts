import Note from "../note/Note";
import { Employee, flashMsg, Book, Membership } from "../types/Types";

export default class Validate {
  static employeeInput(employee: Employee): flashMsg[] {
    const {
      username,
      newpass1,
      newpass2,
      name,
      surname,
      email
    } = employee;
    const errors: flashMsg[] = [];

    // Username
    Validate.username({ username, name, surname }) || errors.push(
      Note.error("Invalid username input!")
    );
    // Password
    Validate.password(newpass1) || errors.push(
      Note.error("Invalid password input!")
    );
    // Password confirmation
    newpass1 === newpass2 || errors.push(
      Note.error("Passwords don't match!")
    );
    // Name
    Validate.nameSurname(name) || errors.push(
      Note.error("Invalid name input!")
    );
    // Surname
    Validate.nameSurname(surname) || errors.push(
      Note.error("Invalid surname input!")
    );
    // E-mail
    Validate.email(email) || errors.push(
      Note.error("Invalid e-mail input!")
    );

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
    return (/^([A-Z|a-z]){1}(\w|[-.]){6,18}([A-Z|a-z]|[0-9]){1}$/).test(pass);
  }

  private static nameSurname(name: string): boolean {
    return (/^([A-ZČĆŠĐŽ]){1}([a-zčćšđž]){1,19}$/).test(name);
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
    Validate.password(newpass1) || errors.push(
      Note.error("Invalid password input!")
    );
    // Password confirmation
    newpass1 === newpass2 || errors.push(
      Note.error("Passwords don't match!")
    );

    return errors;
  }

  static bookInput(book: Book): flashMsg[] {
    const { author, title, year } = book;
    const errors: flashMsg[] = [];

    // Author
    Validate.author(author) || errors.push(
      Note.error("Invalid author input!")
    );
    // Title
    Validate.title(title) || errors.push(
      Note.error("Invalid title input!")
    );
    // Publication year
    Validate.year(year) || errors.push(
      Note.error("Invalid publication year input!")
    );

    return errors
  }

  private static author(author: string): boolean {
    return (/^([A-ZČĆŠĐŽa-zčćšđža-zčćšđž]{2,3} ){0,1}[A-ZČĆŠĐŽ]{1}[a-zčćšđž]{1,19} [A-ZČĆŠĐŽ]{1}[a-zčćšđž]{1,19}( [A-ZČĆŠĐŽ].){0,1}((, (([A-ZČĆŠĐŽa-zčćšđž])[a-zčćšđž]{1,2} ){0,1}[A-ZČĆŠĐŽ]{1}[a-zčćšđž]{1,19} [A-ZČĆŠĐŽ]{1}[a-zčćšđž]{1,19}( [A-ZČĆŠĐŽ].){0,1}){1,4}| et al.{1}){0,1}$/)
      .test(author);
  }

  private static title(title: string): boolean {
    return (/^[A-ZČĆŠĐŽ0-9]{1}([A-ZČĆŠĐŽa-zčćšđž0-9]|[-.,:]|\s){2,59}$/)
      .test(title);
  }

  private static year(year: string): boolean {
    return (/^\d{4}$/).test(year);
  }

  static membershipInput(member: Membership): flashMsg[] {
    const {
      name,
      surname,
      address
    } = member;
    const errors: flashMsg[] = [];

    // Name
    Validate.nameSurname(name) || errors.push(
      Note.error("Invalid name input!")
    );
    // Surname
    Validate.nameSurname(surname) || errors.push(
      Note.error("Invalid surname input!")
    );
    // Address
    Validate.address(address) || errors.push(
      Note.error("Invalid address input!")
    );

    return errors;
  }

  private static address(address: string): boolean {
    return (/^[A-ZČĆŠĐŽ]{1}([A-ZČĆŠĐŽa-zčćšđž]|[-.,]\d|\s){2,59}$/)
      .test(address);
  }
}