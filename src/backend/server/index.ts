

import Express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import Database from "../database";
import { IExpressRoute } from "../util/interfaces";
import {getFilesFromDir} from "../util/utils";

const app = Express();

app.use(Express.static(__dirname + "../../../client"));
app.use(Express.urlencoded({extended: false}));
app.use(Express.json());
app.use(cookieParser());

export default (port: number = 4000, db: Database, callback?: () => void) => {

  const routes = getFilesFromDir(__dirname + "/routes");
  let defaultRoute;
  for (let route of routes) {
      const routeObj = require(`./routes/${route}`).default as IExpressRoute;
      if (routeObj.path === "*") {
        defaultRoute = routeObj;
        continue;
      }
      app[routeObj.method](routeObj.path, routeObj.callback.bind(null, db));
  }
  if (defaultRoute) app[defaultRoute.method](defaultRoute.path, defaultRoute.callback.bind(null, db));

  const server = http.createServer(app);
  server.listen(port, callback);
  return server;
}
