import mongoose from 'mongoose';
import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';

import Config from './config';
import applicationRoutes from './application.routes';

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
    this.config();
    this.mongoSetup();
  
  }
  private config():void{
    this.app.use(bodyParser.json({extends:true}));
    applicationRoutes.registerRoute(this.app);
  }
  private mongoSetup(): void {
    const dbOptions = {
      maxPoolSize: 5,
      useNewUrlParser: true,
    };
    mongoose.connect(mongoUrl, dbOptions);

    mongoose.connection.on('connected', () => {
      console.log('Connect');
    });

    mongoose.connection.on('error', (err) => {
      console.log(`DATABASE - Error:${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('DATABASE - disconnected  Retrying....');
    });
  }
}
new app();