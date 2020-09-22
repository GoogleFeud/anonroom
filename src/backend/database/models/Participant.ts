
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
    /** If the participant has a socket property, then they are online! */
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