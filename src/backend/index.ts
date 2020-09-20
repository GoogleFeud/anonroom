

// This should start up the server

import startServer from "./server/index";
import startWebSocket from "./websocket/index";

const server = startServer(4000, () => console.log("Server ready!"));

const ws = startWebSocket(server);