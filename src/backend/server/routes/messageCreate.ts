


import Database from "../../database";
import Express from "express";
import {sendStatus, getIP, sendToDiscordWebhook, sendToSocket} from "../../util/utils";

export default {
    method: "post",
    path: "/room/:roomId/messages",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const body = req.body as IMessageCreateBody;
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        const creator = room.findParicipant(req.cookies[room.id] || getIP(req));
        if (!creator) return sendStatus(res, "Invalid creator!", 400);
        if (!creator.admin && (creator.muted || room.chatLocked || creator.banned)) return sendStatus(res, "Unauthorized!", 401);
        if (typeof body.content !== "string") return sendStatus(res, "Message must be a string!", 400); 
        body.content = body.content.replace(/\s+/g,' ').trim();
        if (!body.content.length || body.content.length > 2048) return sendStatus(res, "Message length must be between 1 and 2048 characters!", 400); 
        const msg = await room.createMessage({content: body.content, authorId: creator.id}, true);
        if (room.discordWebhook) sendToDiscordWebhook(room, creator.name, msg.sentAt, body.content, creator.color);
        res.status(204).end();
    }
}

interface IMessageCreateBody {
    content?: string
}