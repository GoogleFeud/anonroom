

import Express from "express";
import http from "http";
import {getFilesFromDir} from "../util/utils";

const app = Express();

app.use(Express.static(__dirname + "../../client/public"));

export default (port: number = 4000, callback?: () => void) => {

  const routes = getFilesFromDir(__dirname + "/routes");
  for (let route of routes) {
      const routeObj = require(`./routes/${route}`).default as IExpressRoute;
      app[routeObj.method](routeObj.path, routeObj.callback);
  }

  const server = http.createServer(app);
  server.listen(port, callback);
  return server;
}
