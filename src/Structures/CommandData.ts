import { Message, GuildTextableChannel, Guild, } from 'eris';
import Command from './Command';

export default interface CommandData {
	msg: Message;
	channel: GuildTextableChannel;
	guild: Guild;
	command: Command;
	args?: string[];
}