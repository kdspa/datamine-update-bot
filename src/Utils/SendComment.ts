import { Client } from 'eris';
import sendEmbed from './SendEmbed'
const Server = require("./models/Server");
import Bot from '../Main'

export = async function sendCommits(Bot?: Client, comment: string) {
  try {
    Server.find().then((servers) => {
      servers.forEach(async (server) => {
        const s = await this.client.guilds.find(server._id);
        if (s) {
          Server.findByIdAndUpdate(
            s.id,
            { lastSentComment: comment._id },
            (err) => {
              if (err) throw console.error(err);
              if (s && s.channels) {
                const channel: any = s.channels.find(server.channel);
                sendEmbed(channel, comment, server.roleid);
              }
            }
          );
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};