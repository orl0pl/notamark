import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient;
let cachedDb: Db;

async function connectToDatabase(uri: string) {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {});

  await client.connect();
  const db = client.db("notamark");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
if (process.env["DB_CONN_STRING"] == undefined) {
  console.error("Cant find env variable");
}
export default connectToDatabase;
