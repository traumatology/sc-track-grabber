import TelegramApi from 'node-telegram-bot-api'

export type ProcessedMessage = TelegramApi.Message & { text: string }

export interface Command {
    name : string,
    serve : (botApi : TelegramApi, message : ProcessedMessage) => void
}