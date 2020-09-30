



import Database from "../../database";
import Express from "express";
import {sendStatus, getIP} from "../../util/utils";
import WebSocketEvents from "../../util/websocketEvents";

export default {
    method: "post",
    path: "/room/:roomId/participants/:participantId/admin",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        if (room.adminPassword !== req.query.password) return sendStatus(res, "Wrong password!", 400);
        const updator = room.findParicipant(req.cookies[room.id] || getIP(req));
        if (!updator) return sendStatus(res, "Unauthorized", 401);
        if (updator.admin) return sendStatus(res, "You are already admin!", 400);
        room.updateParticipant(updator.id, {admin: true});
        room.sendToAllSockets(WebSocketEvents.PARTICIPANT_UPDATE, {id: updator.id, admin: true});
        res.status(204).end();
    }
}
