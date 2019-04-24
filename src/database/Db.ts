import * as MDB from "mongodb";
import * as assert from "assert";
import Controller from "../controller/Controller";

export default class Db {
  static async insertOne(doc: object, collName: string): Promise<boolean> {
    const { uri, dbName } = Controller.appConfig("db");
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
    } catch (err) {
      if (err) console.log(err);
    }

    return true;
  }

  static async find(doc: object, collName: string): Promise<string> {
    const { uri, dbName } = Controller.appConfig("db");;
    const client: MDB.MongoClient = new MDB.MongoClient(
      uri,
      { useNewUrlParser: true }
    );
    let dbRes: object[];

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

    return JSON.stringify(dbRes);
  }

  static async findOne(doc: any, collName: string): Promise<string> {
    const { uri, dbName } = Controller.appConfig("db");;
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

    return JSON.stringify(dbRes);
  }
}