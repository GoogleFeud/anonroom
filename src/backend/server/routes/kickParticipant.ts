
import Database from "../../database";
import Express from "express";
import {sendStatus} from "../../util/utils";
import WebSocketEvents from "../../util/websocketEvents";

export default {
    method: "post",
    path: "/room/:roomId/participants/:participantId/kick",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const body = req.body as IParticipantKickBody;
        if (!body.kickerId) return sendStatus(res, "Invalid kicker!", 400);
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        const kicker = room.participants.get(body.kickerId);
        if (!kicker || !kicker.admin) return sendStatus(res, "Invalid kicker!", 400);
        const participant = room.participants.get(req.params.participantId);
        if (!participant) return sendStatus(res, "Invalid participant!", 400);
        const allParticipantSockets = room.sockets.get(participant.id);
        if (!allParticipantSockets) return;
        for (let [, socket] of allParticipantSockets) socket.close(4001);
        room.sockets.delete(participant.id);
        room.sendToAllSockets(WebSocketEvents.PARTICIPANT_UPDATE, {id: participant.id, online: false, kicked: true});
        res.status(204).end();
    }
}

export interface IParticipantKickBody {
    kickerId: string
}