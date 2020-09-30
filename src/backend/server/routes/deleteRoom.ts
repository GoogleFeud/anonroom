

import Database from "../../database";
import Express from "express";
import {sendStatus} from "../../util/utils";


import WebSocketEvents from "../../util/websocketEvents";

export default {
    method: "delete",
    path: "/room/:roomId",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "Room doesn't exist!", 400);
        const deletor = room.participantsBySecret.get(req.cookies[room.id]);
        if (!deletor) return sendStatus(res, "Invalid deletor", 401);
        if (!deletor.admin) return sendStatus(res, "Unauthorized", 401);
        await room.delete();
        room.sendToAllSockets(WebSocketEvents.ROOM_CLOSE, {});
    }
};
