import Database from "../../database";
import { IRequestWithBody } from "../../util/interfaces";
import {generateRoomID} from "../../util/utils";

const config = require("../../../../config.json");

export default {
    method: "post",
    path: "/rooms",
    callback: (database: Database, req: IRequestWithBody, res: Express.Response) => {
        const body = req.body as IRoomCreationBody;
        
    }
}

interface IRoomCreationBody {
    maxParticipants: number,
    adminPassword: string
}