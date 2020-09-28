

import Database from "../../database";
import Express from "express";
import {sendStatus, getIP} from "../../util/utils";
import { v4 } from 'uuid';
import WebSocketEvents from "../../util/websocketEvents";
import { IConfig } from "../../util/interfaces";

const config = require("../../../../config.json") as IConfig;

export default {
    method: "post",
    path: "/room/:roomId/join",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const body = req.body as IRoomJoinBody;
        if (!body.name) return sendStatus(res, "Your username must be between 3 and 12 characters long!", 400);
        body.name = body.name.replace(/\s+/g,' ').trim();
        if (body.name === "" || body.name.length > 12 || body.name.length < 2) return sendStatus(res, "Your username must be between 3 and 12 characters long!", 400);
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        if (room.roomLocked) return sendStatus(res, "This room is locked!", 401);
        if (room.maxParticipants === room.participants.size) return sendStatus(res, "Room is full!", 401);
        if (room.nameExists(body.name)) return sendStatus(res, "This name already exists!", 400);
        const ip = getIP(req);
        /** The following 2 lines make it impossible to create multiple participants on the same IP address. Comment them out for testing. */
        //const doesExist = room.findParicipant(req.cookies[room.id] || ip);
        //if (doesExist) return sendStatus(res, `You are already in the room as ${doesExist.name}! Join here: ${config.websiteURL}/room/${room.id}`, 400);
        const secret = v4();
        const participant = await room.addParticipant({
            name: body.name,
            color: body.color,
            id: v4(),
            admin: ip === room.ownerFirstIp,
            ips: [ip],
            muted: false,
            banned: false,
            secret: secret
        });
        room.sendToAllSockets(WebSocketEvents.PARTICIPANT_JOIN, {name: participant.name, id: participant.id, color: participant.color, admin: participant.admin, online: true});
        res.cookie(room.id, secret, {maxAge: 2147483647, httpOnly: true});
        res.status(204).end();
    }
}

interface IRoomJoinBody {
    name: string,
    color?: string
}