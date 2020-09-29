
import { Cursor } from "mongodb";

import WebSocket from "ws";
import { IParticipant, Participant } from "./Participant";
import CustomCollection from "../collections/CustomCollection";
import { ExtendedSocket, ICollectable, IObject } from "../../util/interfaces";

import {sendToSocket} from "../../util/utils";

import WebSocketEvents from "../../util/websocketEvents";
import { IMessage } from "./Message";

export const messagesPerPage = 20;

export class Room {
   collection: CustomCollection<Room>
   id: string
   chatLocked: boolean
   roomLocked: boolean
   participants: Map<string, Participant>
   participantsBySecret: Map<string, Participant>
   maxParticipants?: number
   adminPassword: string
   discordWebhook?: string
   ownerFirstIp: string
   sockets: Map<string, Map<string, ExtendedSocket>>
   constructor(collection: CustomCollection<Room>, data: ICollectable) {
       this.collection = collection;
       this.id = data.id;
       this.chatLocked = data.chatLocked;
       this.roomLocked = data.roomLocked;
       this.participants = new Map(data.participants.map((obj: IParticipant) => [obj.id, new Participant(collection, obj, this)]));
       this.participantsBySecret = new Map(data.participants.map((obj: IParticipant) => [obj.secret, this.participants.get(obj.id)]));
       this.maxParticipants = data.maxParticipants;
       this.adminPassword = data.adminPassword;
       this.discordWebhook = data.discordWebhook;
       this.ownerFirstIp = data.ownerFirstIp;
       this.sockets = new Map();
   }

   paginateMessages(lastFetchedDate: number = 0) : Cursor {
      if (!lastFetchedDate) return this.collection.database.messages.collection.find({roomId: this.id}).sort({sentAt: -1}).limit(messagesPerPage);
      return this.collection.database.messages.collection.find({roomId: this.id, sentAt: {$lt: lastFetchedDate}}).sort({sentAt: 1}).limit(messagesPerPage);
   }

   async createMessage(data: IObject, emitToSockets: boolean = false) : Promise<IMessage> {
       const messageData = {
        content: data.content,
        authorId: data.authorId,
        roomId: this.id,
        sentAt: Date.now()
       }
       await this.collection.database.messages.create(messageData);
       if (emitToSockets) this.sendToAllSockets(WebSocketEvents.MESSAGE_CREATE, messageData);
       return messageData;
   } 

   async delete() : Promise<void> {
       await this.collection.delete(this.id);
       await this.collection.database.messages.collection.deleteMany({roomId: this.id});
   }

   async addParticipant(data: IParticipant) : Promise<Participant> {
       const p = new Participant(this.collection, data, this);
       this.participants.set(data.id, p);
       this.participantsBySecret.set(data.secret, p);
       await this.collection.collection.updateOne({id: this.id}, {$push: {participants: data} });
       return p;
   }

   async removeParticipant(id: string) : Promise<void> {
       const p = this.participants.get(id);
       if (!p) return;
       this.participants.delete(id);
       this.participantsBySecret.delete(p.secret);
       await this.collection.collection.updateOne({id: this.id}, {$pull: { participants: {id: id} } })
   }

   update(newData: IObject) {
       Object.assign(this, newData);
       return this.collection.collection.updateOne({id: this.id}, {$set: newData});
   }

   updateParticipant(pId: string, newData: IObject) {
       const participant = this.participants.get(pId);
       if (!participant) return;
       Object.assign(participant, newData);
       return this.collection.collection.updateOne({"participants.id": pId}, {$set: {"participants.$": participant.asInDB()} });
   }

   findParicipant(SecretOrIP: string) : Participant|undefined {
        if (this.participantsBySecret.has(SecretOrIP)) return this.participantsBySecret.get(SecretOrIP);
        for (let [, p] of this.participants) {
            if (p.ips.includes(SecretOrIP)) return p;
        }
   }
   
   nameExists(name: string) : boolean {
       for (let [, p] of this.participants) {
           if (p.name === name) return true;
       } 
       return false;
   }

   mapParticipants(mapFn: (participant: Participant) => any) : Array<any> {
        const res = [];
        for (let [, p] of this.participants) {
            res.push(mapFn(p));
        }
        return res;
   }

   addSocket(participant: Participant, socket: ExtendedSocket) : void {
       const pSocketsMap = this.sockets.get(participant.id);
       if (!pSocketsMap) this.sockets.set(participant.id, new Map([[socket.id, socket]]));
       else {
           pSocketsMap.set(socket.id, socket);
       }
   } 

   removeSocket(socket: ExtendedSocket) : void {
       if (!socket.participant) return;
       this.sockets.get(socket.participant.id)?.delete(socket.id);
   }

   sendToAllSockets(event: string|number, data: any) : void {
       for (let [, socketCollection] of this.sockets) {
            for (let [, socket] of socketCollection) {
                sendToSocket(socket, event, data);
            }
       }
   }

   forAllSockets(fn: (socket: WebSocket) => void) : void {
    for (let [, socketCollection] of this.sockets) {
        for (let [, socket] of socketCollection) {
            fn(socket);
        }
   }
   }

 
}
