
import { Collection } from "mongodb";
import { stringify } from "uuid";
import { ICollectable } from "../../util/interfaces";
import { Participant } from "./Participant";
import {Room} from "./Room";

export class Message {
    author?: Participant
    room: Room
    content: string
    sentAt: number
    constructor(room: Room, data: IMessage) {
        if (data.authorId) this.author = room.participants.get(data.authorId);
        this.room = room;
        this.content = data.content;
        this.sentAt = data.sentAt;
    }
} 

export interface IMessage {
    authorId?: string,
    content: string,
    roomId: string,
    sentAt: number
}