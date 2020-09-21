
import { IObject } from "../../util/interfaces";
import CustomCollection from "../collections/CustomCollection";
import {Room} from "./Room";
import WebSocket from "ws";

export class Participant {
    name: string
    id: string
    color?: string
    admin: boolean
    ips: Array<string>
    socket?: WebSocket
    collection: CustomCollection<Room>
    constructor(collection: CustomCollection<Room>, data: IParticipant) {
        this.name = data.name;
        this.id = data.id;
        this.color = data.color;
        this.admin = data.admin;
        this.ips = data.ips;
        this.collection = collection;
    }

    update(newData: IObject) {
        return this.collection.collection.updateOne({id: this.id}, {})
    }

}

export interface IParticipant {
    id: string,
    name: string,
    color?: string,
    admin: boolean,
    ips: Array<string>
}

export interface PartialParticipant {
    id: string,
    name: string,
    ips: Array<string>
}