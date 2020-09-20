

import { MongoClient, Db } from "mongodb";
import CustomCollection from "./collections/CustomCollection";

/** Currently, only a MongoDB cloud cluster can be used to store data */

class Database extends MongoClient {
     _db: Db
     constructor(username: string, password: string, dbName: string = "anonroom") {
         super(`"mongodb+srv://${username}:${password}@cluster0.grxvc.mongodb.net/${dbName}?retryWrites=true&w=majority`);
         this._db = this.db(dbName);
     }

}