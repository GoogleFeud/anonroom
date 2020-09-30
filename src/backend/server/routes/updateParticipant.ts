

import Database from "../../database";
import Express from "express";
import {sendStatus, sendToSocket, getIP} from "../../util/utils";
import WebSocketEvents from "../../util/websocketEvents";

export default {
    method: "post",
    path: "/room/:roomId/participants/:participantId",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const body = req.body as IParticipantUpdateBody;
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        const updator = room.findParicipant(req.cookies[room.id] || getIP(req));
        if (!updator) return sendStatus(res, "Invalid updator!", 400);
        const participant = room.participants.get(req.params.participantId);
        if (!updator.admin && ("banned" in body || "muted" in body || "name" in body)) return sendStatus(res, "Unauthorized", 401);
        if (!participant) return sendStatus(res, "Invalid participant!", 400);
        if (participant.admin && updator.admin && participant.id !== updator.id) return sendStatus(res, "Unauthorized", 400);
        if (body.name) {
            body.name = body.name.replace(/\s+/g," ").trim();
            if (body.name === "" || (body.name && (body.name.length > 12 || body.name.length < 2))) return sendStatus(res, "Your username must be between 3 and 12 characters long!", 400);
            if (room.nameExists(body.name)) return sendStatus(res, "This name is taken!", 400);
        }
        let newStatus = participant.isOnline();
        if (body.banned) {
            const allParticipantSockets = room.sockets.get(participant.id);
            if (allParticipantSockets) {
                for (const [, socket] of allParticipantSockets) socket.close(4001);
                room.sockets.delete(participant.id);
                newStatus = false;
            }
        }
        room.updateParticipant(participant.id, body);
        room.sendToAllSockets(WebSocketEvents.PARTICIPANT_UPDATE, {id: participant.id, ...body, online: newStatus});
        res.status(204).end();
    }
};

interface IParticipantUpdateBody {
    color?: string,
    name?: string,
    muted?: boolean,
    banned?: boolean,
}