import { Collection, DeleteWriteOpResultObject, UpdateWriteOpResult } from "mongodb";


export default class CustomCachelessCollection<V> {
    collection: Collection
    constructor(col: Collection) {
        this.collection = col;
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
