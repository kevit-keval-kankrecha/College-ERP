import mongoose, { mongo } from 'mongoose';
import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

import Config from './config';
import applicationRoutes from './application.routes';
import { log } from './utils/winston-logger';

//For use Environment Variable
dotenv.config();

const mongoUrl: string = Config.mongodb.url;
const PORT: string | number = Config.server.port;

class app {
  public app: express.Application;
  public ExpressServer: any;
  constructor() {
    this.app = express();

    const server = http.createServer(this.app);
    this.ExpressServer = server.listen(PORT, () => {
      log.info('Server Started..');
    });
    this.config();
    this.mongoSetup();
  }
  private config(): void {
    this.app.use(bodyParser.json({ extends: true, limit: '50mb' }));
    applicationRoutes.registerRoute(this.app);
  }
  private mongoSetup(): void {
    console.log(mongoUrl);
    const dbOptions = {
      maxPoolSize: 5,
      useNewUrlParser: true,
    };
    mongoose.connect(mongoUrl, dbOptions);

    mongoose.connection.on('connected', () => {
      log.info('Connected');
    });

    mongoose.connection.on('error', (err) => {
      log.info(`DATABASE - Error:${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      log.info('DATABASE - disconnected  Retrying....');
    });
  }
}
export default new app().ExpressServer;
//new app();
