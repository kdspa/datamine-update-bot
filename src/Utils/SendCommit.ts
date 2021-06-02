import { Client } from 'eris';
import getLatestCommit from './LatestCommit';
import * as Commit from '../Database/Models/Commit'
import * as Server from '../Database/Models/Server'
import sendEmbed  from './SendEmbed'

export = async function sendCommits(Bot: Client) {
  const servers = await Server.find();
  for (const server of servers) {
    const s = await Bot.guilds.find(server._id);
    if (s && s.channels) {
      const channel: any = s.channels.find(server.channel);
      getLatestCommit().then(async (commit) => {
        if (!server.lastSentComment) {
          await Server.findByIdAndUpdate(server._id, {
            lastSentComment: commit._id,
          });
          return await sendEmbed(channel, commit, server.roleId);
        } else if (commit._id > server.lastSentComment) {
          const commits = await Commit.find({
            _id: { $gt: server.lastSentComment },
          }).sort("_id");

          for (const commit of commits) {
            await Server.findByIdAndUpdate(server._id, {
              lastSentComment: commit._id,
            });
            await sendEmbed(channel, commit, server.roleId);
          }
        }
      });
    }
  }
};