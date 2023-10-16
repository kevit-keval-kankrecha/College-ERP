import mongoose from 'mongoose';
import * as express from 'express';
import * as http from 'http';

import Config from './config';
import { log } from './utils/winston-logger';

const mongoUrl: string = Config.mongodb.url;
const PORT: string | number = Config.server.port;

class app {
  public app: express.Application;

  constructor() {
    this.app = express();

    const server = http.createServer(this.app);
    server.listen(PORT, () => {
      console.log('Server Started..');
    });

    this.mongoSetup();
  }
  private mongoSetup(): void {
    const dbOptions = {
      maxPoolSize: 5,
      useNewUrlParser: true,
    };
    mongoose.connect(mongoUrl, dbOptions);

    mongoose.connection.on('connected', () => {
      log.info("Connected");
    });

    mongoose.connection.on('error', (err) => {
      log.info(`DATABASE - Error:${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      log.info('DATABASE - disconnected  Retrying....');
    });
  }
}
new app();