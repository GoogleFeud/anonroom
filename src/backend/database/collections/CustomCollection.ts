import { Collection, DeleteWriteOpResultObject, UpdateWriteOpResult } from "mongodb";
import { IObject } from "../../util/interfaces";
import Database from "..";


export default class CustomCollection<V> {
    collection: Collection
    database: Database
    objectType: any
    constructor(col: Collection, objectType: any, db: Database) {
        this.collection = col;
        this.database = db;
        this.objectType = objectType;
    }

    async get(id: string) : Promise<V|null> {
        const v = await this.collection.findOne({id});
        if (!v) return null;
        return new this.objectType(this, v);
    }

    async update(id: string, edit: IObject) : Promise<UpdateWriteOpResult> {
        return this.collection.updateOne({id}, {$set: edit});
    }

    async create(obj: IObject) : Promise<V> {
        const c = await this.collection.insertOne(obj);
        return new this.objectType(this, c);
    }

    async delete(id: string) : Promise<DeleteWriteOpResultObject> {
        return this.collection.deleteOne({id});
    }

}
