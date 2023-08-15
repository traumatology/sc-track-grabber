export interface ResolveResponse {
    kind : string,
    id : number,
    permalink: string
}

export interface TracksResponse {
    collection : Track[]
}

export interface Track {
    id : number,
    title : string
    media : {
        transcodings : {
            url : string,
            format : {
                protocol : 'hsl' | 'progressive'
            }
        }[]
    }
}

export interface ArtistResponse {
    permalink_url : string
}