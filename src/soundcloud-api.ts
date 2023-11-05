import { updateSoundcloudClientId } from './cron-jobs/update-soundcloud-client-id.js'
import { ArtistResponse, ResolveResponse, Track, TracksResponse } from './types/soundcloud-api-responses.js'

const API_BASE_URL = 'https://api-v2.soundcloud.com'

export let clientId = process.env['SOUNDCLOUD_API_CLIENT_ID']
export function setClientId(newValue: string) { clientId = newValue }
await updateSoundcloudClientId()

export async function getResourceByUrl(url : string) : Promise<ResolveResponse> {
    const resolveResponse = await fetch(API_BASE_URL + `/resolve?url=${url}&client_id=${clientId}`)

    if(!resolveResponse.ok) {
        throw new Error()
    }
    
    return await resolveResponse.json()
}

export async function getArtistTracks(artistId : number) : Promise<TracksResponse> {
    console.log('getting tracks with :' + clientId)
    
    const tracksResponse = await fetch(API_BASE_URL + `/users/${artistId}/tracks?client_id=${clientId}`
        + '&limit=80000')
    
    if(!tracksResponse.ok) {
        throw new Error()
    }

    return await tracksResponse.json()
}

export async function getArtistData(artistId : number) : Promise<ArtistResponse> {
    const artistResponse = await fetch(API_BASE_URL + `/users/${artistId}?client_id=${clientId}`)
    
    if(!artistResponse.ok) {
        throw new Error()
    }

    return await artistResponse.json()
}

export async function getTrackFileUrl(track : Track) : Promise<string> {
    const neededTranscoding = track.media.transcodings.find(
        (transcoding) => transcoding.format.protocol === 'progressive'
    )

    if (!neededTranscoding) {
        throw new Error()
    }

    const fileUrlResponse = await fetch(neededTranscoding.url + `?client_id=${clientId}`)

    if(!fileUrlResponse.ok) {
        throw new Error()
    }

    return (await fileUrlResponse.json()).url
}