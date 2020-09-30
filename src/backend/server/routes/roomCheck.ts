
import Database from "../../database";
import Express from "express";
import {sendStatus, getIP} from "../../util/utils";


export default {
    method: "get",
    path: "/room/:roomId/check",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        if (room.roomLocked) return sendStatus(res, "This room is locked!", 401);
        const visitorIp = getIP(req);
        const participant = room.findParicipant(req.cookies[room.id] || visitorIp);
        if (!participant) return res.send({id: room.id, in: false});
        if (participant.banned) return sendStatus(res, "You are banned from this room!", 401);
        if (!participant.ips.includes(visitorIp)) room.updateParticipant(participant.id, {ips: [...participant.ips, visitorIp]});
        if (!req.cookies[room.id]) res.cookie(room.id, participant.secret, {maxAge: 2147483647, httpOnly: true});
        return res.send({id: room.id, in: true});
    }
};

