import { Collection, DeleteWriteOpResultObject, UpdateWriteOpResult } from "mongodb";


export default class CustomCollection<V> {
    collection: Collection
    cache: Map<string, V>
    constructor(col: Collection, cache: Map<string, V>) {
        this.collection = col;
        this.cache = cache;
    }

    async get(id: string) : Promise<V|undefined> {
        if (this.cache.has(id)) return this.cache.get(id);
        const item = await this.collection.findOne({id});
        if (!item) return;
        this.cache.set(id, item);
        return item;
    }

    async getOrCreate(id: string, data?: IObject) : Promise<V> {
        if (this.cache.has(id)) return this.cache.get(id) as V;
        const item = await this.collection.findOneAndUpdate({id}, data) as V;
        this.cache.set(id, item);
        return item;
    }

    async update(id: string, edit: IObject) : Promise<UpdateWriteOpResult> {
        this.cache.delete(id);
        return this.collection.updateOne({id}, {$set: edit});
    }

    async delete(id: string) : Promise<DeleteWriteOpResultObject> {
        this.cache.delete(id);
        return this.collection.deleteOne({id});
    }

}