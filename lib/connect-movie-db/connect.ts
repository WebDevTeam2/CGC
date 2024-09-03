import { MongoClient, MongoClientOptions } from "mongodb";

const URI = process.env.MONGODB_URI as string;
const options: MongoClientOptions = {};

if (!URI) throw new Error("Please add your Mongo URI to .env.local file");

let client: MongoClient = new MongoClient(URI, options);
let clientPromise: Promise<MongoClient>;

// Allow access to the global object in TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/* If the environment is not production, the code stores the 
MongoDB client promise (clientPromise) in a global variable 
(global._mongoClientPromise). This prevents creating a new 
MongoDB connection every time the code is executed 
(e.g., when your application reloads during development).
*/
if (process.env.NODE_ENV !== "production") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
