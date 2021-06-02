import * as chalk from 'chalk';
import * as moment from 'moment'

const emoji = {
    info: 0x2139,
    debug: 0x2699,
    warn: 0x26A0,
    error: 0x1F525,
    success: 0x2705
}

function info(message: string): void {
    let emojiFormat = String.fromCharCode(emoji.info);
    let timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss:SSS');
    console.info(chalk.green(`[${timestamp}]`) + `${emojiFormat}` + chalk.white(message))
}

function debug(message: string): void {
    let emojiFormat = String.fromCharCode(emoji.debug);
    let timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss:SSS');
    console.log(chalk.blue(`[${timestamp}]`) + `${emojiFormat}` + chalk.white(message))
}

function warn(message: string): void {
    let emojiFormat = String.fromCharCode(emoji.warn);
    let timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss:SSS');
    console.warn(chalk.yellow(`[${timestamp}]`) + `${emojiFormat}` + chalk.white(message))
}

function error(message: string): void {
    let emojiFormat = String.fromCharCode(emoji.error);
    let timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss:SSS');
    console.error(chalk.red(`[${timestamp}]`) + `${emojiFormat}` + chalk.white(message))
}

function success(message: string): void {
    let emojiFormat = String.fromCharCode(emoji.success);
    let timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss:SSS');
    console.log(chalk.green(`[${timestamp}]`) + `${emojiFormat}` + chalk.white(message))
}

const logger = {
    info: info,
    debug: debug,
    warn: warn,
    error: error,
    success: success
}

export default logger