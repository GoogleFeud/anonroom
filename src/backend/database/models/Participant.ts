
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
    muted: boolean
    banned: boolean
    /** If the participant has a socket property, then they are online! */
    collection: CustomCollection<Room>
    room: Room
    constructor(collection: CustomCollection<Room>, data: IParticipant, room: Room) {
        this.name = data.name;
        this.id = data.id;
        this.color = data.color;
        this.admin = data.admin;
        this.ips = data.ips;
        this.collection = collection;
        this.muted = data.muted;
        this.banned = data.banned;
        this.room = room;
    }

}

export interface IParticipant {
    id: string,
    name: string,
    color?: string,
    admin: boolean,
    ips: Array<string>
    muted: boolean,
    banned: boolean
}
