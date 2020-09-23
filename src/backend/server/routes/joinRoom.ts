

import Database from "../../database";
import Express from "express";
import {sendStatus, getIP} from "../../util/utils";
import { v4 as uuidv4 } from 'uuid';

export default {
    method: "post",
    path: "/room/:roomId/join",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const body = req.body as IRoomJoinBody;
        if (body.name.length > 12 || body.name.length < 2) return sendStatus(res, "Your username must be between 3 and 14 characters long!", 400);
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        if (room.maxParticipants === room.participants.size) return sendStatus(res, "Room is full!", 401);
        const id = uuidv4();
        await room.addParticipant({
            name: body.name,
            id: id,
            admin: false,
            ips: [getIP(req)],
            muted: false
        });
        res.cookie(room.id, id, {maxAge: 2147483647, httpOnly: true});
        res.status(204).end();
    }
}

interface IRoomJoinBody {
    name: string
}