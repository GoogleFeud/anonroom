
import Database from "../../database";
import Express from "express";
import {sendStatus, getIP} from "../../util/utils";


export default {
    method: "get",
    path: "/room/:roomId/check",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        const visitorIp = getIP(req);
        let participant = room.findParicipant(req.cookies[room.id] || visitorIp);
        if (!participant) return res.send({id: room.id, in: false});
        if (!participant.ips.includes(visitorIp)) room.updateParticipant(participant.id, {ips: [...participant.ips, visitorIp]});
        if (!req.cookies[room.id]) res.cookie(room.id, participant.id, {maxAge: 2147483647});
        return res.send({id: room.id, in: true});
    }
}

