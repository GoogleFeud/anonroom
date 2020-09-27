

import Database from "../../database";
import Express from "express";
import {sendStatus} from "../../util/utils";

import WebSocketEvents from "../../util/websocketEvents";

export default {
    method: "post",
    path: "/room/:roomId/",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const body = req.body as IRoomUpdateBody;
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        const updator = room.participantsBySecret.get(req.cookies[room.id]);
        if (!updator) return sendStatus(res, "Invalid updator!", 400);
        if (body.discordWebhook != undefined) {
            if (body.discordWebhook === "") body.discordWebhook = undefined;
            else if (!/discordapp.com\/api\/webhooks\/([^\/]+)\/([^\/]+)/.test(body.discordWebhook)) return sendStatus(res, "Invalid discord webhook URL!", 400);
            else body.discordWebhook = body.discordWebhook.trim();
        }
        if (body.maxParticipants != undefined) {
            if (body.maxParticipants === 0) body.maxParticipants = undefined;
            else if (body.maxParticipants < 0) return sendStatus(res, "Max participants must be a positive number, or 0 for unlimited participants.", 400);
        }
        room.update(body);
        room.sendToAllSockets(WebSocketEvents.ROOM_UPDATE, body);
        res.status(204).end()
    }
}

interface IRoomUpdateBody {
    maxParticipants?: number,
    chatLocked?: boolean,
    roomLocked?: boolean,
    discordWebhook?: string
}