import { ArtistResponse, ResolveResponse, Track, TracksResponse } from './types/soundcloud-api-responses.js'

const API_BASE_URL = 'https://api-v2.soundcloud.com'
const CLIENT_ID = process.env['SOUNDCLOUD_API_CLIENT_ID']

export async function getResourceByUrl(url : string) : Promise<ResolveResponse> {
    const resolveResponse = await fetch(API_BASE_URL + `/resolve?url=${url}&client_id=${CLIENT_ID}`)

    if(!resolveResponse.ok) {
        throw new Error()
    }
    
    return await resolveResponse.json()
}

export async function getArtistTracks(artistId : number) : Promise<TracksResponse> {
    const tracksResponse = await fetch(API_BASE_URL + `/users/${artistId}/tracks?client_id=${CLIENT_ID}`
        + '&limit=80000')
    
    if(!tracksResponse.ok) {
        throw new Error()
    }

    return await tracksResponse.json()
}

export async function getArtistData(artistId : number) : Promise<ArtistResponse> {
    const artistResponse = await fetch(API_BASE_URL + `/users/${artistId}?client_id=${CLIENT_ID}`)
    
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

    const fileUrlResponse = await fetch(neededTranscoding.url + `?client_id=${CLIENT_ID}`)

    if(!fileUrlResponse.ok) {
        throw new Error()
    }

    return (await fileUrlResponse.json()).url
}