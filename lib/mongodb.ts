// mongodb.ts

import { MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;


declare global {
  interface Global {
    _mongoClientPromise?: Promise<MongoClient>;
  }
}

if (!uri) {
  throw new Error('Add Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
