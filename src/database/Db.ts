import * as MDB from "mongodb";
import Controller from "../controller/Controller";
import { Employee, Book, DocumentQuery, Membership } from "../customTypes/customTypes";

export default class Db {
  static async insertOne(doc: object, collName: string): Promise<boolean> {
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

  static async deleteOne(doc: Employee | Book, collName: string): Promise<boolean> {
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