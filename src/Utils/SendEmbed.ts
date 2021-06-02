const ConstructEmbed = require("./ConstructEmbed");
import { NewsChannel, TextChannel } from 'eris';
import { Document, Model } from 'mongoose';
import Commit from '../Managers/EmbedManager'


export = async function sendEmbed(channel: TextChannel|NewsChannel, commit: ICommit, roleid?: string) {
  try {
    if (!channel) return;
    if (!commit) return;

    const commitMSG = await channel.createMessage(
      roleid ? `<@&${roleid}>` : "",
      ConstructEmbed(commit)
    );

    if (channel.type === 5) {
      try {
        commitMSG.crosspost();
      } catch (error) {
        console.error(error.message);
      }
    }

    if (commit.images && commit.images.length > 0) {
      if (commit.images.length <= 5) {
        const imgMSG = await channel.createMessage(commit.images.join("\n"));
        if (channel.type === 5) {
          try {
            imgMSG.crosspost();
          } catch (error) {
            console.error(error.message);
          }
        }
      }
    }

    if (commit.comments) {
      for (comment of commit.comments) {
        await sendEmbed(channel, {
          title: commit.title,
          ...comment,
        });
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }
};