import { eq, ne } from 'drizzle-orm'
import { db } from '../db/drizzle-client.js'
import { tracksReceiverChats } from '../db/schemas/tracks-receiver-chats.js'
import { Command } from '../types/command.js'
import { getArtistTracks, getResourceByUrl, getTrackFileUrl } from '../soundcloud-api.js'
import { artists } from '../db/schemas/artists.js'
import { tracks } from '../db/schemas/tracks.js'

export const add : Command = {
    name: 'add',
    async serve(botApi, message) {
        const foundChats = await db.select().from(tracksReceiverChats)
            .where(eq(tracksReceiverChats.id, message.chat.id))
        
        if(foundChats.length === 0) {
            await db.insert(tracksReceiverChats).values({
                id: message.chat.id
            })
        }

        const commandParts = message.text.split(' ')

        if(!commandParts[1]) {
            botApi.sendMessage(message.chat.id, 'specify target soundcloud profile url')
            return
        }

        try {
            botApi.sendMessage(message.chat.id, 'requesting artist profile info...')

            const artistData = await getResourceByUrl(commandParts[1])

            if(artistData.kind !== 'user') {
                throw new Error()
            }

            const foundArtists = await db.select().from(artists).where(eq(artists.id, artistData.id))

            if(foundArtists.length > 0) {
                throw new Error()
            }
            
            await db.insert(artists).values({
                id: artistData.id,
                username: artistData.permalink
            })

            botApi.sendMessage(message.chat.id, 'requesting tracks...')

            const artistTracks = (await getArtistTracks(artistData.id)).collection

            for(const track of artistTracks) {
                const trackFileUrl = await getTrackFileUrl(track)

                await db.insert(tracks).values({
                    id: track.id,
                    artistId: artistData.id,
                    trackFileUrl
                })
            }

            botApi.sendMessage(message.chat.id, 'started tracking this profile, ill hit you up ' 
                + 'if something is posted on it. type \'/list\' to view all artists that are being tracked')
        }
        catch(error) {
            botApi.sendMessage(message.chat.id, 'failed to get artist soundcloud profile info, ' + 
                'perhaps this artist is already being tracked or entered url is invalid')
        }
    }
}