
import Express from "express";
import path from "path";

export default {
    method: "get",
    path: "/",
    callback: (req: Express.Request, res: Express.Response) => {
        res.sendFile(path.resolve(__dirname + "../../../../client/public/index.html"));
    }
}