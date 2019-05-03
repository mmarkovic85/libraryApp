import * as fs from "fs";
import * as path from "path";
import { Application } from "express";
import Db from "../database/Db";
import Guard from "../guard/Guard";
import Note from "../note/Note";
import Router from "../router/Router";
import Validate from "../validate/Validate";
import Activity from "../activity/Activity";
import {
  flashMsg,
  Employee,
  Book,
  Membership,
  ConfigObj,
  DocumentQuery
} from "../types/Types";

export default class Controller {
  static map(app: Application): void {
    Controller.admin();
    Guard.config();
    Router.GET(app);
    Router.POST(app);
    Router.PUT(app);
    Router.DELETE(app);
    Router.error404(app);
  }
  // Default admin check
  private static admin(): void {
    const { username, password } = Controller.appConfig().defaultAdmin;

    Db
      .findOne({ username }, "libraryEmployees")
      .then((user: Employee): void => {
        user || Controller.defaultAdmin({ username, password });
      })
      .catch((err: Error): void => console.log(err));;
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

        Db
          .insertOne({
            doc: admin,
            collName: "libraryEmployees",
            id: "server init"
          })
          .catch((err: Error): void => console.log(err));;
      })
      .catch((err: Error): void => console.log(err));
  }
  // Read/write app config json
  static appConfig(configUpdate?: ConfigObj): ConfigObj | undefined {
    let config: ConfigObj;

    configUpdate ?

      fs.writeFileSync(
        path.join(__dirname, "../../", "appconfig.json"),
        JSON.stringify(configUpdate),
        "utf8",
      ) :

      config = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "../../", "appconfig.json"),
          "utf8"
        )
      );

    return config;
  }

  static filterInput(
    searchParams: Employee & Book & Membership,
    isEmployee: boolean = true
  ): object {

    const {
      author,
      title,
      year,
      language,
      username,
      name,
      surname,
      email,
      address,
      status
    } = searchParams;
    let inputs: object[] = [];

    // Weed out empty search fields
    author && inputs.push({
      author: { $regex: new RegExp(author, "i") }
    });
    title && inputs.push({
      title: { $regex: new RegExp(title, "i") }
    });
    year && inputs.push({
      year: { $regex: new RegExp(year, "i") }
    });
    language && inputs.push({
      language: { $regex: new RegExp(language, "i") }
    });
    username && inputs.push({
      username: { $regex: new RegExp(username, "i") }
    });
    name && inputs.push({
      name: { $regex: new RegExp(name, "i") }
    });
    surname && inputs.push({
      surname: { $regex: new RegExp(surname, "i") }
    });
    email && inputs.push({
      email: { $regex: new RegExp(email, "i") }
    });
    address && inputs.push({
      address: { $regex: new RegExp(address, "i") }
    });
    status && inputs.push({
      status: { $regex: new RegExp(status, "i") }
    });

    return inputs.length ?
      { $and: inputs } :
      isEmployee ?
        {} :
        null;
  }

  static async findOne(
    document: Employee | Book,
    collection: string
  ): Promise<Employee | Book> {

    return await Db.findOne(
      document,
      collection
    );
  }

  static async addBook(doc: Book, id: string): Promise<flashMsg[]> {
    const msgs: flashMsg[] = Validate.bookInput(doc);

    if (msgs.length === 0) {
      await Db
        .insertOne({
          doc,
          collName: "libraryBooks",
          id
        }) ?

        msgs.push(Note.success("Book successfully saved!")) :
        msgs.push(Note.error("Book was not saved!"));
    }

    return msgs;
  }

  static async addEmployee(doc: Employee, id: string): Promise<flashMsg[]> {
    const msgs: flashMsg[] = Validate.employeeInput(doc);

    if (msgs.length === 0) {
      const { username, newpass1, name, surname, email, isAdmin } = doc;

      if (
        await Db
          .findOne(
            { $or: [{ username }, { email }] },
            "libraryEmployees"
          )
      ) {

        msgs.push(Note.error("Username or email already exists!"));

      } else {

        await Db
          .insertOne(
            {
              doc: {
                username,
                password: await Guard.generateHash(newpass1),
                name,
                surname,
                email,
                isAdmin
              },
              collName: "libraryEmployees",
              id
            }) ?

          msgs.push(Note.success("Employee successfully saved!")) :
          msgs.push(Note.error("Database error!"));

      }
    }

    return msgs;
  }

  static async addMembership(
    doc: Membership,
    id: string
  ): Promise<flashMsg[]> {

    const msgs: flashMsg[] = Validate.membershipInput(doc);

    if (msgs.length === 0) {
      await Db
        .insertOne({
          doc,
          collName: "libraryMemberships",
          id
        }) ?

        msgs.push(Note.success("Membership successfully saved!")) :
        msgs.push(Note.error("Membership was not saved!"));

    }

    return msgs;
  }

  static async bookSearch(doc: Book, isEmployee: boolean): Promise<string> {
    const query: object = Controller.filterInput(
      doc,
      isEmployee
    );

    return JSON.stringify(
      query ?
        await Db.find(query, "libraryBooks") :
        []
    );
  }

  static async employeeSearch(doc: Employee): Promise<string> {
    const query: object = Controller.filterInput(doc);

    const dbRes: Employee[] = query ?
      await Db.find(query, "libraryEmployees") :
      [];

    return JSON.stringify(
      // omit password hash from response
      dbRes.map((e: Employee): Employee => {
        const { _id, username, name, surname, email, isAdmin } = e;
        return { _id, username, name, surname, email, isAdmin }
      })
    );
  }

  static async membershipSearch(doc: Membership): Promise<string> {
    const query: object = Controller.filterInput(doc);

    return JSON.stringify(
      query ?
        await Db.find(query, "libraryMemberships") :
        []
    );
  }

  static async setPassword(doc: Employee, id: string): Promise<flashMsg[]> {
    const msgs: flashMsg[] = Validate.passwordInput(doc);

    if (msgs.length === 0) {
      const { _id, newpass1 } = doc;
      const hash: string = await Guard.generateHash(newpass1);
      const updateData: DocumentQuery = {
        _id,
        document: {
          password: hash
        }
      };

      const isUpdated: boolean = await Db.updateOne(
        updateData,
        "libraryEmployees"
      );

      isUpdated && Activity.log({
        userId: id,
        type: "password",
        action: "change",
        data: id === _id ?
          null :
          { _id }
      });

      isUpdated ?
        msgs.push(Note.success("Password successfully updated!")) :
        msgs.push(Note.error("Password was not updated!"));

    }

    return msgs;
  }

  static async editBook(doc: Book, id: string): Promise<flashMsg[]> {
    const { isAvailable } = doc;
    const msgs: flashMsg[] = Validate.bookInput(doc);

    isAvailable || msgs.push(Note.error("Can't edit lended book!"));

    if (msgs.length === 0) {
      const { _id, author, title, year, language } = doc;
      const updateData: DocumentQuery = {
        _id,
        document: {
          author,
          title,
          year,
          language
        }
      }

      const isUpdated: boolean = await Db.updateOne(
        updateData,
        "libraryBooks"
      );

      isUpdated && Activity.log({
        userId: id,
        type: "book",
        action: "edit",
        data: doc
      })

      isUpdated ?
        msgs.push(Note.success("Book successfully edited!")) :
        msgs.push(Note.error("Book was not updated!"));
    }

    return msgs;
  }

  static async editMember(doc: Membership, id: string): Promise<flashMsg[]> {
    const msgs: flashMsg[] = Validate.membershipInput(doc);

    if (msgs.length === 0) {
      const { _id, name, surname, address, status } = doc;
      const updateData: DocumentQuery = {
        _id,
        document: {
          name,
          surname,
          address,
          status
        }
      }

      const isUpdated: boolean = await Db.updateOne(
        updateData,
        "libraryMemberships"
      );

      isUpdated && Activity.log({
        userId: id,
        type: "member",
        action: "edit",
        data: doc
      })

      isUpdated ?
        msgs.push(Note.success("Member successfully edited!")) :
        msgs.push(Note.error("Member was not updated!"));

    }

    return msgs;
  }

  static async bookDelete({
    user_id,
    delete_id,
    isAvailable
  }): Promise<flashMsg[]> {

    return !isAvailable ?

      [Note.error("Cannot delete borrowed book!")] :

      await Db.deleteOne({
        doc: { _id: delete_id },
        collName: "libraryBooks",
        id: user_id
      }) ?
        [Note.success("Book successfully deleted!")] :
        [Note.error("Book was not deleted!")];
  }

  static async employeeDelete({ user_id, delete_id }): Promise<flashMsg[]> {
    return user_id === delete_id ?

      [Note.error("Cannot delete account in use!")] :

      await Db.deleteOne({
        doc: { _id: delete_id },
        collName: "libraryEmployees",
        id: user_id
      }) ?
        [Note.success("Employee successfully deleted!")] :
        [Note.error("Employee was not deleted!")];
  }

  static async memberDelete({ user_id, delete_id }): Promise<flashMsg[]> {
    const member = await Db.findOne({ _id: delete_id }, "libraryMemberships");

    return member.books.length > 0 ?

      [Note.error("Can't delete member who currently have landed books!")] :

      await Db.deleteOne({
        doc: { _id: delete_id },
        collName: "libraryMemberships",
        id: user_id
      }) ?
        [Note.success("Member successfully deleted!")] :
        [Note.error("Member was not deleted!")];
  }

  static async memberBooksSearch(temp: string[]): Promise<Book[]> {
    const books: Book[] = [];

    for (let i = 0; i < temp.length; i++) {
      books.push(
        await Db.findOne({ _id: temp[i] }, "libraryBooks")
      );
    }

    return books;
  }

  static async editMemberBooks(
    doc: Membership,
    id: string
  ): Promise<flashMsg[]> {

    const { _id, books, returned } = doc;
    // update member
    await Db.updateOne({ _id, document: { books } }, "libraryMemberships");

    // update books
    for (let i = 0; i < books.length; i++) {
      await Db.updateOne({
        _id: books[i], document: { isAvailable: false }
      }, "libraryBooks");
    }
    books.length > 0 && Activity.log({
      userId: id,
      type: "book",
      action: "lended",
      data: {
        _id,
        books
      }
    });

    for (let i = 0; i < returned.length; i++) {
      await Db.updateOne({
        _id: returned[i], document: { isAvailable: true }
      }, "libraryBooks");
    }
    returned.length > 0 && Activity.log({
      userId: id,
      type: "book",
      action: "returned",
      data: {
        _id,
        returned
      }
    });

    return [Note.success("Member books updated!")];
  }
}