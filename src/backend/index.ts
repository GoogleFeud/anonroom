

// This should start up the server
import { Config } from "./util/interfaces";
const config = require("../../config.json") as Config;

import startServer from "./server/index";
import startWebSocketServer from "./websocket/index";
import Database from "./database/index";


const db = new Database(config.dbUsername, config.dbPassword);

db.connect().then(() => {
    const server = startServer(4000, db, () => console.log("Server ready!"));
    startWebSocketServer(server, db);
});

