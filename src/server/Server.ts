import * as express from "express";
import * as expressLayout from "express-ejs-layouts";
import * as session from "express-session";
import * as passport from "passport";
import Controller from "../controller/Controller";

export default class Server {

  static goLive(port: number): void {
    const server: express.Application = express();

    Server.configure(server);
    Server.start(server, port);
  }

  private static configure(server: express.Application): void {
    // view engine => EJS
    server.set('view engine', 'ejs');
    // EJS layout
    server.use(expressLayout);
    server.set('layout', './components/layout');
    // EJS static files
    server.use(express.static('./public'));
    // Body-parser
    server.use(express.urlencoded({ extended: false }));
    server.use(express.json());
    // Express session
    server.use(
      session({
        secret: 'libraryApp',
        resave: true,
        saveUninitialized: true
      })
    );
    // Passport middleware
    server.use(passport.initialize());
    // Passport session
    server.use(passport.session());
    // Routes
    Controller.map(server);
  }

  private static start(server: express.Application, port: number) {
    // Server port config
    const serverPort = process.env.PORT || port

    server.listen(
      serverPort,
      (): void => console.log(`Server is live on port ${serverPort}`)
    );
  }
}