import { Client } from 'eris';
import Command from './Structures/Command'
import fs, { chmod } from 'fs';
import CommitHandler from './Managers/CommitHandler';
import getLatestCommit from './Utils/LatestCommit'
import sendCommits from './Utils/SendCommit';
import logger from './Logger'
import * as config from '../config.json';

class Bot {
    client: Client
    commands = new Map<string, Command>();
    constructor() {
    }

    get logger() {
        return logger;
    }

    get config() {
        return config;
    }

    async setup(token: string) {
    
        const clientOptions: object = {
            defaultImageFormat: config.options.defaultImageFormat || 'png',
            restMode: config.options.restMode || true,
            intents: config.options.intents || [ 'guilds', 'guildMessages' ]
        }

        this.client = new Client(token, clientOptions)

        this.client.once('ready', this.ready.bind(this));

        this.login()
    }

    async updateStatus(status) {
        status = `${(await getLatestCommit()).title.split("-")[1].trim().split(" ")[0]}.js` || config.playingStatus
		this.client.editStatus('online', { name: status, type: 3 });
	}

    login() {
        this.client.connect();
    }

    loadCommands(): void {
        const path = `./Commands`;

        try {
            const files = fs.readdirSync(path);
            files.forEach(file => {
                try {
                    this.registerCommand(path + '/' + file)
                } catch(err) {
                    logger.error(`[CommandManager] Failed to load command from ${file}: ${err.message}`)
                }
            })
        } catch(err) {
            logger.error(`[CommandManager] ${err.message}`)
        }
    }

    async registerCommand(path: string): Promise<void> {
        const cmd = require(path);
        try {
            const command: Command = new cmd(path);
            this.commands.set(command.name, command)

            logger.debug(`[CommandManager] Registering command ${command.name}`)
        } catch (err) {
            logger.error(`[CommandManager] Failed to register ${name}: ${err.message}`)
        }
    }

    async ready() {
        logger.info(`${this.client.user.username} ready!`);
        await sendCommits(this.client);
        await CommitHandler();
        setInterval(CommitHandler, 30000);
    }
}

export default Bot
