

import { MongoClient, Db, MongoCallback } from "mongodb";
import CacheCollection from "./collections/CacheCollection";
import CustomCollection from "./collections/CustomCollection";

import {Message} from "./models/Message";
import {Room} from "./models/Room";

/** Currently, only a MongoDB cloud cluster can be used to store data */

export default class Database extends MongoClient {
     _db: Db
     _dbname: string
     rooms: CacheCollection<Room>
     messages: CustomCollection<Message>
     constructor(username: string, password: string, dbName: string = "anonroom") {
         super(`mongodb+srv://${username}:${password}@cluster0.grxvc.mongodb.net/${dbName}?retryWrites=true&w=majority`);
         this._dbname = dbName;
         
         /**To satisfy the typescript gods */
         this._db = {} as Db;
         this.messages = {} as CustomCollection<Message>;
         this.rooms = {} as CacheCollection<Room>;
     }

     async connect() : Promise<MongoClient> {
        await super.connect();
        this._db = this.db(this._dbname);
        this.messages = new CustomCollection(this._db.collection("messages"), this);
        this.rooms = new CacheCollection(this._db.collection("rooms"), this, new Map<string, Room>());
        return this;
     }

}