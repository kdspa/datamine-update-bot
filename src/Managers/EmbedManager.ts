import { Embed, EmbedField, GuildTextableChannel, Message } from 'eris';
import createEmbed from '../Structures/Embed'
import { Document } from 'mongoose';

export default interface Commit {
  title: string;
  description: string;
  url: string;
  user: {
      username: string;
      avatarURL: string;
      url: string
  }
  timestamp: string
}

