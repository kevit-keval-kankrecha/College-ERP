const Config = {
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/college',
  },
  server: {
    port: process.env.PORT || 3000,
  },
};
export default Config;
