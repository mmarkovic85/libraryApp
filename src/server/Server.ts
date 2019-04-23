import * as express from "express";
import * as expressLayout from "express-ejs-layouts";
import * as session from "express-session";
import * as passport from "passport";
import Router from "../router/Router";

export default class Server {

  static goLive(serverPort: number): void {
    const server: express.Application = Server.configure();

    // server port config
    server.listen(
      process.env.PORT || serverPort,
      (): void => console.log(`Server is live on port ${
        process.env.PORT || serverPort
        }`)
    );

    // test
  }

  private static configure(): express.Application {
    const app: express.Application = express();

    // view engine => EJS
    app.set('view engine', 'ejs');
    // EJS layout
    app.use(expressLayout);
    app.set('layout', './components/layout');
    // EJS static files
    app.use(express.static('./public'));

    // Body-parser
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // Express session
    app.use(
      session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
      })
    );

    // Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // routes
    Router.map(app);

    return app;
  }
}