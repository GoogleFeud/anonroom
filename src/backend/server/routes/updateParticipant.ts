

import Database from "../../database";
import Express from "express";
import {sendStatus} from "../../util/utils";
import WebSocketEvents from "../../util/websocketEvents";

export default {
    method: "post",
    path: "/room/:roomId/participants/:participantId",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const body = req.body as IParticipantUpdateBody;
        if (!body.updatorId) return sendStatus(res, "Invalid updator!", 400);
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        const updator = room.participants.get(body.updatorId);
        if (!updator) return sendStatus(res, "Invalid updator!", 400);
        const participant = room.participants.get(req.params.participantId);
        if (!updator.admin && ("banned" in body || "muted" in body || "name" in body)) return sendStatus(res, "Invalid updator!", 400);
        if (!participant) return sendStatus(res, "Invalid participant!", 400);
        if (participant.admin && updator.admin && participant.id !== updator.id) return sendStatus(res, "Invalid participant!", 400);
        if (body.name === "" || (body.name && (body.name.length > 12 || body.name.length < 2))) return sendStatus(res, "Your username must be between 3 and 12 characters long!", 400);
        delete body.updatorId;
        let newStatus = participant.isOnline();
        if (body.banned) {
            const allParticipantSockets = room.sockets.get(participant.id);
            if (!allParticipantSockets) return;
            for (let [, socket] of allParticipantSockets) socket.close(4001);
            room.sockets.delete(participant.id);
            newStatus = false;
        }
        room.updateParticipant(participant.id, body);
        room.sendToAllSockets(WebSocketEvents.PARTICIPANT_UPDATE, {id: participant.id, ...body, online: newStatus});
        res.status(204).end();
    }
}

interface IParticipantUpdateBody {
    updatorId?: string,
    color?: string,
    name?: string,
    muted?: boolean,
    banned?: boolean,
}