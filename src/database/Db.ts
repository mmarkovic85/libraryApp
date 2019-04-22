import * as MDB from "mongodb";
import * as fs from "fs";
import * as path from "path";
import * as assert from "assert";

export default class Db {
  // read config json
  private static config(): string {
    return fs.readFileSync(
      path.join(__dirname, "../../", "appconfig.json"),
      "utf8"
    );
  }

  static async insertOne(doc: object, collName: string): Promise<boolean> {
    const { uri, title } = JSON.parse(Db.config()).db;
    const client: MDB.MongoClient = new MDB.MongoClient(
      uri,
      { useNewUrlParser: true }
    );

    try {
      await client.connect();

      const dbRes: MDB.InsertOneWriteOpResult = await client
        .db(title)
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
    const { uri, title } = JSON.parse(Db.config()).db;
    const client: MDB.MongoClient = new MDB.MongoClient(
      uri,
      { useNewUrlParser: true }
    );
    let dbRes: object[];

    try {
      await client.connect();

      dbRes = await client
        .db(title)
        .collection(collName)
        .find(doc)
        .toArray();

      client.close();
    } catch (err) {
      if (err) console.log(err);
    }

    return JSON.stringify(dbRes);
  }
}