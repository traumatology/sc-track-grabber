import TelegramBot from 'node-telegram-bot-api'
import { db } from '../db/drizzle-client.js'
import { tracks } from '../db/schemas/tracks.js'
import { getArtistData, getArtistTracks, getResourceByUrl, getTrackFileUrl } from '../soundcloud-api.js'
import { supabase } from '../supabase.js'
import { tracksReceiverChats } from '../db/schemas/tracks-receiver-chats.js'

export async function grabNewTracks(botApi : TelegramBot) {
    console.log(new Date() + ' : Grabbing.....**...&')

    const receivers = await db.select().from(tracksReceiverChats)
    const artists = await db.query.artists.findMany({ with: { tracks: true } })

    let notificationSent = false

    artists.forEach(async (artist, artistIndex) => {
        try {
            const tracksFromApi = await getArtistTracks(artist.id)

            tracksFromApi.collection.forEach(async (trackFromApi, trackIndex) => {
                if(!artist.tracks.find(track => track.id === trackFromApi.id) || artist.tracks.length === 0) {
                    const trackFileUrl = await getTrackFileUrl(trackFromApi)
                    const fileResponse = await fetch(trackFileUrl)
    
                    if(fileResponse.ok) {
                        const trackFile = await fileResponse.blob()
    
                        await supabase.storage.from('grabbed-tracks-files').upload(`${trackFromApi.id}.mp3`, trackFile)
                        const storageFileUrlResponse = supabase.storage.from('grabbed-tracks-files')
                            .getPublicUrl(`${trackFromApi.id}.mp3`)
    
                        receivers.forEach(receiver => {
                            botApi.sendMessage(receiver.id, `new track from ${artist.username} called ` 
                                + `'${trackFromApi.title}' was saved. download here - ` 
                                + storageFileUrlResponse.data.publicUrl)
                        })
    
                        await db.insert(tracks).values({
                            id: trackFromApi.id,
                            trackFileUrl,
                            artistId: artist.id
                        })
                    }
                }

                if(artistIndex === artists.length - 1 && trackIndex === tracksFromApi.collection.length - 1) {
                    console.log(new Date() + ' : checked for new tracks\n\n')
                }
            })
        }
        catch(error) {
            if(!notificationSent) {
                receivers.forEach(receiver => {
                    botApi.sendMessage(receiver.id, 'error in scheduled track grabbing, sc client id is prob expired')
                })
                notificationSent = true
            }
        }
    })
}