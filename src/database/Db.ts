import * as MDB from "mongodb";
import Controller from "../controller/Controller";
import Activity from "../activity/Activity";
import { Employee, Book, DocumentQuery, Membership } from "../customTypes/customTypes";

export default class Db {
  private static type(collName: string): string {
    switch (collName) {
      case "libraryBooks":
        return "book";
      case "libraryEmployees":
        return "employee";
      case "libraryMemberships":
        return "member";
    }
  };

  static async insertOne({ doc, collName, id }): Promise<boolean> {
    const { uri, dbName } = Controller.appConfig().db;
    const client: MDB.MongoClient = new MDB.MongoClient(
      uri,
      { useNewUrlParser: true }
    );


    await client.connect();

    const dbRes: MDB.InsertOneWriteOpResult = await client
      .db(dbName)
      .collection(collName)
      .insertOne(doc);

    client.close();

    const { _id, username, name, surname, author, title, year, status, address } = dbRes.ops[0]

    Activity.log({
      userId: id,
      action: "create",
      type: Db.type(collName),
      data: { _id, username, name, surname, author, title, year, status, address }
    });

    return dbRes.insertedCount === 1;

  }

  static async find(doc: Employee | Book, collName: string): Promise<Employee[] | Book[] | Membership[]> {
    const { uri, dbName } = Controller.appConfig().db;;
    const client: MDB.MongoClient = new MDB.MongoClient(
      uri,
      { useNewUrlParser: true }
    );

    await client.connect();

    const dbRes: Employee[] | Book[] | Membership[] = await client
      .db(dbName)
      .collection(collName)
      .find(doc)
      .toArray();

    client.close();

    return dbRes;
  }

  static async findOne(doc: Employee | Book | Membership, collName: string): Promise<Employee & Book & Membership> {
    const { uri, dbName } = Controller.appConfig().db;;
    const client: MDB.MongoClient = new MDB.MongoClient(
      uri,
      { useNewUrlParser: true }
    );
    // Parse MongoDB _id
    const query: object = doc._id ?
      { _id: new MDB.ObjectID(doc._id) } :
      doc;

    await client.connect();

    const dbRes: Employee & Book & Membership = await client
      .db(dbName)
      .collection(collName)
      .findOne(query)

    client.close();

    return dbRes;
  }

  static async deleteOne({ doc, collName, id }): Promise<boolean> {
    const { uri, dbName } = Controller.appConfig().db;;
    const client: MDB.MongoClient = new MDB.MongoClient(
      uri,
      { useNewUrlParser: true }
    );

    await client.connect();

    const dbRes: MDB.DeleteWriteOpResultObject = await client
      .db(dbName)
      .collection(collName)
      .deleteOne({ _id: new MDB.ObjectID(doc._id) });

    client.close();

    Activity.log({
      userId: id,
      action: "delete",
      type: Db.type(collName),
      data: { _id: doc._id }
    });

    return dbRes.deletedCount === 1;

  }

  static async updateOne(doc: DocumentQuery, collName: string): Promise<boolean> {
    const { uri, dbName } = Controller.appConfig().db;;
    const client: MDB.MongoClient = new MDB.MongoClient(
      uri,
      { useNewUrlParser: true }
    );
    const { document, _id } = doc;

    await client.connect();

    const dbRes: MDB.UpdateWriteOpResult = await client
      .db(dbName)
      .collection(collName)
      .updateOne({ _id: new MDB.ObjectID(_id) }, { $set: document });

    client.close();

    return dbRes.modifiedCount === 1;
  }
}