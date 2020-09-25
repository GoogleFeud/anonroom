
import { Cursor } from "mongodb";

import { IParticipant, Participant } from "./Participant";
import CustomCollection from "../collections/CustomCollection";
import { ExtendedSocket, ICollectable, IObject } from "../../util/interfaces";

import {sendToSocket} from "../../util/utils";

export const messagesPerPage = 20;

export class Room {
   collection: CustomCollection<Room>
   id: string
   chatLocked: boolean
   roomLocked: boolean
   participants: Map<string, Participant>
   maxParticipants?: number
   adminPassword: string
   discordWebhook?: string
   sockets: Map<string, Map<string, ExtendedSocket>>
   constructor(collection: CustomCollection<Room>, data: ICollectable) {
       this.collection = collection;
       this.id = data.id;
       this.chatLocked = data.chatLocked;
       this.roomLocked = data.roomLocked;
       this.participants = new Map(data.participants.map((obj: IParticipant) => [obj.id, new Participant(collection, obj, this)]));
       this.maxParticipants = data.maxParticipants;
       this.adminPassword = data.adminPassword;
       this.discordWebhook = data.discordWebhook;
       this.sockets = new Map();
   }

   paginateMessages(currentPage: number) : Cursor {
      if (currentPage === 1) return this.collection.database.messages.collection.find({roomId: this.id}).limit(messagesPerPage);
      else return this.collection.database.messages.collection.find({roomId: this.id}).skip((messagesPerPage * currentPage - 1)).limit(messagesPerPage);
   }

   async delete() : Promise<void> {
       await this.collection.delete(this.id);
       await this.collection.database.messages.collection.deleteMany({roomId: this.id});
   }

   async addParticipant(data: IParticipant) : Promise<Participant> {
       const p = new Participant(this.collection, data, this);
       this.participants.set(data.id, p);
       await this.collection.collection.updateOne({id: this.id}, {$push: {participants: data} });
       return p;
   }

   async removeParticipant(id: string) : Promise<void> {
       this.participants.delete(id);
       await this.collection.collection.updateOne({id: this.id}, {$pull: { participants: {id: id} } })
   }

   update(newData: IObject) {
       Object.assign(this, newData);
       return this.collection.collection.updateOne({id: this.id}, {$set: newData});
   }

   updateParticipant(pId: string, newData: IObject) {
       const participant = this.participants.get(pId);
       Object.assign(participant, newData);
       return this.collection.collection.updateOne({id: this.id, "participants.id": pId}, {$set: newData });
   }

   findParicipant(pIdOrIP: string) : Participant|undefined {
        if (this.participants.has(pIdOrIP)) return this.participants.get(pIdOrIP);
        for (let [, p] of this.participants) {
            if (p.ips.includes(pIdOrIP)) return p;
        }
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

 
}
