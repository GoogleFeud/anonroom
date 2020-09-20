import { Collection, DeleteWriteOpResultObject, UpdateWriteOpResult } from "mongodb";
import { IObject } from "../../util/interfaces";
import Database from "..";


export default class CustomCollection<V> {
    collection: Collection
    database: Database
    constructor(col: Collection, db: Database) {
        this.collection = col;
        this.database = db;
    }

    async get(id: string) : Promise<V|null> {
        return this.collection.findOne({id});
    }

    async update(id: string, edit: IObject) : Promise<UpdateWriteOpResult> {
        return this.collection.updateOne({id}, {$set: edit});
    }

    async delete(id: string) : Promise<DeleteWriteOpResultObject> {
        return this.collection.deleteOne({id});
    }

}
