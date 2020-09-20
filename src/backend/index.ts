

// This should start up the server

import startServer from "./server/index";

startServer(4000, () => console.log("Server ready!"));