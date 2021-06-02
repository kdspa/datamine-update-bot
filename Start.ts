import Bot from './src/Main';
import * as Database from './src/Database/Database';
import * as config from './config.json'

const bw = new Bot();
const db = new Database();

bw.setup(config.token);

db(config.db.dsn, config.db.name);

bw.client.on("ready", async () => {
  bw.ready()
});

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);