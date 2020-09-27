

import Database from "../../database";
import Express from "express";
import {sendStatus, getIP} from "../../util/utils";


export default {
    method: "post",
    path: "/room/:roomId/",
    callback: async (database: Database, req: Express.Request, res: Express.Response) => {
        
    }
}

interface IRoomUpdateBody {
    maxParticipants?: number,
    chatLocked?: boolean,
    roomLocked?: boolean,
    discordWebhook?: string
}