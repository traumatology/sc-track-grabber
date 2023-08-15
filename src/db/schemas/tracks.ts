import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { artists } from './artists.js'

export const tracks = pgTable('tracks', {
    id: integer('id').primaryKey().notNull(),
    trackFileUrl: text('track_file_url').notNull(),
    artistId: integer('artist_id'),
})

export const tracksRelations = relations(tracks, relationTypes => ({
    artist: relationTypes.one(artists, {
        fields: [ tracks.artistId ],
        references: [ artists.id ]
    })
}))