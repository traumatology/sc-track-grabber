import { relations } from 'drizzle-orm'
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core'
import { tracks } from './tracks.js'

export const artists = pgTable('artists', {
    id: integer('id').notNull().primaryKey(),
    username: varchar('username', { length: 30 }).unique()
})

export const artistsRelations = relations(artists, relationTypes => ({
    tracks: relationTypes.many(tracks)
}))