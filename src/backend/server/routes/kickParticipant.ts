
import Database from "../../database";
import Express from "express";
import {sendStatus, sendToSocket, getIP} from "../../util/utils";
import WebSocketEvents from "../../util/websocketEvents";

export default {
    method: "post",
    path: "/room/:roomId/participants/:participantId/kick",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        const kicker = room.findParicipant(req.cookies[room.id] || getIP(req));
        if (!kicker) return sendStatus(res, "Invalid kicker!", 400);
        if (!kicker.admin) return sendStatus(res, "Unauthorized", 401);
        const participant = room.participants.get(req.params.participantId);
        if (!participant || participant.admin) return sendStatus(res, "Invalid participant!", 400);
        const allParticipantSockets = room.sockets.get(participant.id);
        if (allParticipantSockets) {
            for (const [, socket] of allParticipantSockets) socket.close(4001);
            room.sockets.delete(participant.id);
            room.forAllSockets(socket => {
                sendToSocket(socket, WebSocketEvents.PARTICIPANT_UPDATE, {id: participant.id, online: false, kicked: true});
                sendToSocket(socket, WebSocketEvents.MESSAGE_CREATE, room.createMessage({content: `${participant.name} has been kicked by ${kicker.name}`}));
            });
        }

        res.status(204).end();
    }
};