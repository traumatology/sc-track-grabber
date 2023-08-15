import dotenv from 'dotenv'
import TelegramApi from 'node-telegram-bot-api'
import { db } from './db/drizzle-client.js'
import { tracks } from './db/schemas/tracks.js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import commands from './commands/commands.js'
import { ProcessedMessage } from './types/command.js'
import cron from 'node-cron'
import { grabNewTracks } from './cron-jobs/grab-new-tracks.js'

dotenv.config()

const botApiToken = process.env['TELEGRAM_BOT_API_TOKEN']

if(!botApiToken) {
    throw new Error('Environment variable \'TELEGRAM_BOT_API_TOKEN\' was not provided')
}

const botApi = new TelegramApi(botApiToken, { polling: true })

botApi.on('message', message => {
    if(message.from?.username !== 'disgracing') {
        botApi.sendMessage(message.chat.id, 'u r not allowed mf')
        return
    }

    commands.forEach(command => {
        if(message.text && message.text.startsWith('/' + command.name)) {
            command.serve(botApi, message as ProcessedMessage)
        }
    })
})

cron.schedule('*/1 * * * *', async () => await grabNewTracks(botApi))