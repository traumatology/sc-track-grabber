import TelegramBot, { InlineKeyboardButton } from 'node-telegram-bot-api'
import { db } from '../db/drizzle-client.js'
import { artists } from '../db/schemas/artists.js'
import { Command } from '../types/command.js'
import { eq } from 'drizzle-orm'
import { tracks } from '../db/schemas/tracks.js'

let queryListener : ((query : TelegramBot.CallbackQuery) => void) | undefined = undefined

export const untrack : Command = {
    name: 'untrack',
    async serve(botApi, message) {
        try {
            const artistsData = await db.select().from(artists)

            const artistButtons = artistsData.map<InlineKeyboardButton[]>(artist => {
                return [{
                    text: artist.username || '???',
                    callback_data: String(artist.id)
                }]
            })
            
            botApi.sendMessage(message.chat.id, 'select artist u want to stop tracking', {
                reply_markup: {
                    inline_keyboard: artistButtons
                }
            })

            if(queryListener) {
                botApi.removeListener('callback_query', queryListener)
            }

            queryListener = async (query) => {
                if(query.data) {
                    botApi.sendMessage(message.chat.id, 'deleting artist.......;.')

                    await db.delete(artists).where(eq(artists.id, +query.data))
                    await db.delete(tracks).where(eq(tracks.artistId, +query.data))

                    botApi.sendMessage(message.chat.id, 'done, i wont track this artist anymore')
                }

                if(queryListener) {
                    botApi.removeListener('callback_query', queryListener)
                }
            }

            botApi.addListener('callback_query', queryListener)
        }
        catch(error) {
            botApi.sendMessage(message.chat.id, 'smth went wrong while getting artist')
        }
    }
}