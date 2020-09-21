
import Express from "express";
import path from "path";
import Database from "../../database";

export default {
    method: "get",
    path: "/",
    callback: (database: Database, req: Express.Request, res: Express.Response) => {
        res.sendFile(path.resolve(__dirname + "../../../../client/html/index.html"));
    }
}