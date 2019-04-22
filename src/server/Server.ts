import * as express from "express";
import * as expressLayout from "express-ejs-layouts";
import Router from "../router/Router";

export default class Server {

  static goLive(serverPort: number): void {
    const server: express.Application = express();

    // view engine => EJS
    server.set('view engine', 'ejs');
    // EJS layout
    server.use(expressLayout);
    server.set('layout', './components/layout');
    // static files
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

    // test
  }
}