import Database from "../../../database";
import Express from "express";
import { IConfig, IRequestWithBody } from "../../../util/interfaces";
import {generateRoomID, sendStatus, getIP } from "../../../util/utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../../../../config.json") as IConfig;

export default {
    method: "post",
    path: "/room",
    callback: async (database: Database, req: IRequestWithBody, res: Express.Response) => {
        const body = req.body as IRoomCreationBody;
        if (!body.adminPassword) return sendStatus(res, "You must provide an admin password!", 400);
        if (body.adminPassword.length < 6 || body.adminPassword.length > 16) return sendStatus(res, "Password must be between 6 and 16 characters long!", 400);
        if (/\s/.test(body.adminPassword)) return sendStatus(res, "Admin password cannot contain any white spaces!", 400);
        if (body.maxParticipants != undefined && body.maxParticipants < 1) body.maxParticipants = undefined; 
        if (body.lockChat != undefined && typeof body.lockChat !== "boolean") return sendStatus(res, "lockChat property must be a boolean!", 400);
        if (body.discordWebhook != undefined) {
            if (body.discordWebhook === "") body.discordWebhook = undefined;
            // eslint-disable-next-line no-useless-escape
            else if (!/discord.com\/api\/webhooks\/([^\/]+)\/([^\/]+)/.test(body.discordWebhook)) return sendStatus(res, "Invalid discord webhook URL!", 400);
            else body.discordWebhook = body.discordWebhook.trim();
        }
        const roomId = generateRoomID(18);
        await database.rooms.create({
            id: roomId,
            adminPassword: encodeURI(body.adminPassword.trim()),
            maxParticipants: body.maxParticipants,
            participants: [],
            chatLocked: body.lockChat,
            roomLocked: false,
            discordWebhook: body.discordWebhook,
            ownerFirstIp: getIP(req as Express.Request)
        });
        res.send({link: `${config.websiteURL}/room/${roomId}/`});
    }
};


interface IRoomCreationBody {
    maxParticipants?: number,
    adminPassword: string,
    lockChat: boolean,
    discordWebhook?: string
}