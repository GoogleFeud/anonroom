import Database from "../../database";
import Express from "express";
import { IConfig, IRequestWithBody } from "../../util/interfaces";
import {generateRoomID, sendStatus} from "../../util/utils";

const config = require("../../../../config.json") as IConfig;

export default {
    method: "post",
    path: "/rooms",
    callback: async (database: Database, req: IRequestWithBody, res: Express.Response) => {
        const body = req.body as IRoomCreationBody;
        if (!body.adminPassword) return sendStatus(res, "You must provide an admin password!", 400);
        if (body.adminPassword.length < 6 || body.adminPassword.length > 16) return sendStatus(res, "Password must be between 6 and 16 characters long!", 400);
        if (body.maxParticipants != undefined && body.maxParticipants < 1) body.maxParticipants = undefined; 
        const roomId = generateRoomID();
        await database.rooms.create({
            id: roomId,
            adminPassword: body.adminPassword,
            maxParticipants: body.maxParticipants,
            participants: [],
            chatLocked: false,
            roomLocked: false,
            banned: []
        });
        res.send({link: config.websiteURL + roomId});
    }
}

interface IRoomCreationBody {
    maxParticipants?: number,
    adminPassword: string
}