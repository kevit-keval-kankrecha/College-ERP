import * as dotenv from 'dotenv';

dotenv.config();

const Config = {
  mongodb: {
    url: process.env.MONGODB_URL,
  },
  server: {
    port: process.env.PORT,
  },
};
export default Config;
