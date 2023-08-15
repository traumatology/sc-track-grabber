import { db } from '../db/drizzle-client.js'
import { artists } from '../db/schemas/artists.js'
import { getArtistData, getResourceByUrl } from '../soundcloud-api.js'
import { Command } from '../types/command.js'

export const list : Command = {
    name: 'list',
    async serve(botApi, message) {
        try {
            const artistsFromDB = await db.select().from(artists)
            let artistUrls = []

            botApi.sendMessage(message.chat.id, 'getting artist urls...>><')

            for(const artist of artistsFromDB) {
                const artistData = await getArtistData(artist.id)
                artistUrls.push(artistData.permalink_url)
            }

            botApi.sendMessage(message.chat.id, artistUrls
                .reduce((previousValue, currentUrl) => previousValue + '\n' + currentUrl))
        }
        catch(error) {
            botApi.sendMessage(message.chat.id, 'failed to get artist list')
        }
    }
}