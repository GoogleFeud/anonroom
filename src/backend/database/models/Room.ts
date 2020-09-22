
import { Cursor } from "mongodb";

import { IParticipant, PartialParticipant, Participant } from "./Participant";
import CustomCollection from "../collections/CustomCollection";
import { ICollectable, IObject } from "../../util/interfaces";

export const messagesPerPage = 20;

export class Room {
   collection: CustomCollection<Room>
   id: string
   chatLocked: boolean
   roomLocked: boolean
   participants: Map<string, Participant>
   banned: Array<PartialParticipant>
   messagesCursor: Cursor
   maxParticipants?: number
   adminPassword: string
   constructor(collection: CustomCollection<Room>, data: ICollectable) {
       this.collection = collection;
       this.id = data.id;
       this.chatLocked = data.chatLocked;
       this.roomLocked = data.roomLocked;
       this.participants = new Map(data.participants.map((obj: IParticipant) => [obj.id, new Participant(collection, obj)]));
       this.banned = data.banned;
       this.messagesCursor = collection.database.messages.collection.find({roomId: this.id});
       this.maxParticipants = data.maxParticipants;
       this.adminPassword = data.adminPassword;
   }

   paginateMessages(currentPage: number) : Cursor {
       return this.messagesCursor.skip(messagesPerPage * currentPage - 1).limit(messagesPerPage);
   }

   async delete() : Promise<void> {
       await this.collection.delete(this.id);
       await this.collection.database.messages.collection.deleteMany({roomId: this.id});
   }

   async addParticipant(data: IParticipant) : Promise<Participant> {
       const p = new Participant(this.collection, data);
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
 
}
