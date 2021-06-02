import * as mongoose from 'mongoose';
import * as config from '../../config.json'

export default class Database {

    dsn: string;
    name: string;
    constructor(dsn: string, name: string) {

        mongoose.connect(dsn, {
            dbName: name,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })

        const connection = mongoose.connection;
        
        connection.on('error', console.error.bind(console, 'Connection error:'));
        connection.once('open', () => {
            console.log('Successfully connected to Mongo')
        })
    }
}