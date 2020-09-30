




import Database from "../../database";
import Express from "express";
import {sendStatus, getIP} from "../../util/utils";

export default {
    method: "get",
    path: "/room/:roomId/messages/page",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        const room = await database.rooms.get(req.params.roomId);
        if (!room) return sendStatus(res, "This room doesn't exist!", 400);
        const requestor = room.findParicipant(req.cookies[room.id] || getIP(req));
        if (!requestor) return sendStatus(res, "Unauthorized!", 401);
        const page = Number(req.query.lastMessageSentAt);
        if (!page || isNaN(page)) return sendStatus(res, "Invalid page!", 400);
        const messages = await room.paginateMessages(page).toArray();
        return res.json(messages).end();
    }
};
