import * as MDB from "mongodb";
import * as assert from "assert";
import Controller from "../controller/Controller";
import { Employee, Book, DocumentQuery } from "../customTypes/customTypes";

export default class Db {
  static async insertOne(doc: object, collName: string): Promise<boolean> {
    const { uri, dbName } = Controller.appConfig().db;
    const client: MDB.MongoClient = new MDB.MongoClient(
      uri,
      { useNewUrlParser: true }
    );

    try {
      await client.connect();

      const dbRes: MDB.InsertOneWriteOpResult = await client
        .db(dbName)
        .collection(collName)
        .insertOne(doc);

      assert.strictEqual(1, dbRes.insertedCount, "Document not inserted!");

      client.close();

      return dbRes.insertedCount === 1;
    } catch (err) {
      if (err) console.log(err);
    }
  }

  static async find(doc: Employee & Book, collName: string): Promise<Employee[] | Book[]> {
    const { uri, dbName } = Controller.appConfig().db;;
    const client: MDB.MongoClient = new MDB.MongoClient(
      uri,
      { useNewUrlParser: true }
    );
    let dbRes: Employee & Book[];

    try {
      await client.connect();

      dbRes = await client
        .db(dbName)
        .collection(collName)
        .find(doc)
        .toArray();

      client.close();
    } catch (err) {
      if (err) console.log(err);
    }

    return dbRes;
  }

  static async findOne(doc: Employee | Book, collName: string): Promise<Employee | Book> {
    const { uri, dbName } = Controller.appConfig().db;;
    const client: MDB.MongoClient = new MDB.MongoClient(
      uri,
      { useNewUrlParser: true }
    );
    let dbRes: object;
    // Parse MongoDB _id
    const query: object = doc._id ?
      { _id: new MDB.ObjectID(doc._id) } :
      doc;

    try {
      await client.connect();

      dbRes = await client
        .db(dbName)
        .collection(collName)
        .findOne(query)
    } catch (err) {
      if (err) console.log(err);
    }

    client.close();

    return dbRes;
  }

  static async deleteOne(doc: Employee | Book, collName: string): Promise<boolean> {
    const { uri, dbName } = Controller.appConfig().db;;
    const client: MDB.MongoClient = new MDB.MongoClient(
      uri,
      { useNewUrlParser: true }
    );
    try {
      await client.connect();

      const dbRes: MDB.DeleteWriteOpResultObject = await client
        .db(dbName)
        .collection(collName)
        .deleteOne({ _id: new MDB.ObjectID(doc._id) });

      assert.equal(1, dbRes.deletedCount, "Document not deleted!");

      client.close();

      return dbRes.deletedCount === 1;
    } catch (err) {
      if (err) console.log(err);
    }
  }

  static async updateOne(doc: DocumentQuery, collName: string): Promise<boolean> {
    const { uri, dbName } = Controller.appConfig().db;;
    const client: MDB.MongoClient = new MDB.MongoClient(
      uri,
      { useNewUrlParser: true }
    );
    const { document, _id } = doc;

    try {
      await client.connect();

      const dbRes: MDB.UpdateWriteOpResult = await client
        .db(dbName)
        .collection(collName)
        .updateOne({ _id: new MDB.ObjectID(_id) }, { $set: document });

      assert.equal(1, dbRes.modifiedCount, "Document not updated!!");

      client.close();

      return dbRes.modifiedCount === 1;
    } catch (err) {
      if (err) console.log(err);
    }
  }
}