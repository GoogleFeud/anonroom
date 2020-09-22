import Database from "../../database";
import { IRequestWithBody } from "../../util/interfaces";


export default {
    method: "post",
    path: "/rooms",
    callback: (database: Database, req: IRequestWithBody, res: Express.Response) => {
        console.log(1, req.body);
    }
}