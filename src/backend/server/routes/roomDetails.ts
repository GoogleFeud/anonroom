


import Database from "../../database";
import Express from "express";
import {sendStatus, getIP} from "../../util/utils";
import { IConfig } from "../../util/interfaces";
import Url from "url";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../../../../config.json") as IConfig;

export default {
    method: "get",
    path: "/room/:roomId/details",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        const participant = room.findParicipant(req.cookies[room.id] || getIP(req));
        if (!participant) return sendStatus(res, "You must be in the room to access this endpoint!", 400);
        if (participant.banned) return sendStatus(res, "You are banned from this room!", 401);
        return res.send({
            requesterId: participant.id,
            gatewayURL: new Url.URL(config.websiteURL).host + config.websocketPath,
            room: {
                id: room.id,
                chatLocked: room.chatLocked,
                roomLocked: room.roomLocked,
                maxParticipants: room.maxParticipants,
                discordWebhook: room.discordWebhook,
                participants: room.mapParticipants(p => ({id: p.id, muted: p.muted, banned: p.banned, admin: p.admin, color: p.color, name: p.name, online: p.isOnline()})),
                messages: await room.paginateMessages().toArray()
            }
        });
    }
};