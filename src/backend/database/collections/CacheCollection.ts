import { Collection, DeleteWriteOpResultObject, UpdateWriteOpResult } from "mongodb";
import { IObject } from "../../util/interfaces";
import Database from "..";
import CustomCollection from "./CustomCollection";

export default class CacheCollection<V> extends CustomCollection<V> {
    collection: Collection
    cache: Map<string, V>
    constructor(col: Collection, database: Database, objectType: any, cache: Map<string, V>) {
        super(col, objectType, database);
        this.collection = col;
        this.cache = cache;
    }

    async get(id: string) : Promise<V|null> {
        if (this.cache.has(id)) return this.cache.get(id) as V;
        const item = await this.collection.findOne({id});
        if (!item) return null;
        const itemClass = new this.objectType(this, item);
        this.cache.set(id, itemClass);
        return itemClass;
    }

    async update(id: string, edit: IObject) : Promise<UpdateWriteOpResult> {
        this.cache.delete(id);
        return this.collection.updateOne({id}, {$set: edit});
    }

    async create(obj: IObject) : Promise<V> {
        await this.collection.insertOne(obj);
        const classObj = new this.objectType(this, obj);
        this.cache.set(obj.id, classObj);
        return classObj;
    }

    async delete(id: string) : Promise<DeleteWriteOpResultObject> {
        this.cache.delete(id);
        return this.collection.deleteOne({id});
    }

}