import { Collection } from "mongodb";


export default class Participant {
    name: string
    id: string
    color: string
    admin: boolean
    constructor(collection: Collection, data: ICollectable) {
        this.name = data.name;
        this.id = data.id;
        this.color = data.color;
        this.admin = data.admin;
    }
}