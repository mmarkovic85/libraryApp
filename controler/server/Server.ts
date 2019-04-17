import * as express from "express";
import Router from "../router/Router";

export default class Server {

  static goLive(serverPort: number): void {
    const server: express.Application = express();

    // view engine => ejs
    server.set('view engine', 'ejs');

    server.use(express.static('./public'));

    // routes
    Router.map(server);

    // server port config
    server.listen(
      process.env.PORT || serverPort,
      (): void => console.log(`Server is live on port ${
        process.env.PORT || serverPort
        }`)
    );
  }

}