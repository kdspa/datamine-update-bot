import { Client, Message } from 'eris';
import CommandData from './CommandData';
const commands = require('./Commands');

function parseArgs(prefix: string, content: string) {
  const parsed = content.split(prefix)[1].split(" ");
  const cmd = parsed[0];
  parsed.shift();
  return { cmd, args: parsed };
}

// class Command {
//    name: string;
//    aliases: string|string[];
//    description: string;
//    usage: string;
//    example: string|string[];
//  
//    execute(t: CommandData): Promise<any> {
//  }
//}

module.exports = (Bot: Client, msg: Message) => {
  const prefix = 'd.';
  if (msg.content.startsWith(prefix)) {
    const { args, cmd } = parseArgs(prefix, msg.content);
    if (commands[cmd]) {
      commands[cmd](msg, args, Bot);
    }
  }
};