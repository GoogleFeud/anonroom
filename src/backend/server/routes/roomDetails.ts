


import Database from "../../database";
import Express from "express";
import {sendStatus, getIP} from "../../util/utils";


export default {
    method: "get",
    path: "/room/:roomId/details",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        let participant = room.findParicipant(req.cookies[room.id] || getIP(req));
        if (!participant) return sendStatus(res, "You must be in the room to access this endpoint!", 400);
        if (participant.banned) return sendStatus(res, "You are banned from this room!", 401);
        return res.send({
            requesterId: participant.id,
            id: room.id,
            chatLocked: room.chatLocked,
            roomLocked: room.roomLocked,
            maxParticipants: room.maxParticipants,
            discordWebhook: room.discordWebhook,
            participants: room.mapParticipants(p => ({id: p.id, muted: p.muted, banned: p.banned, admin: p.admin, color: p.color})),
            messagesPage: 1,
            messages: await room.paginateMessages(1).toArray()
        });
    }
}