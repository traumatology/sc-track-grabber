import { integer, pgTable } from 'drizzle-orm/pg-core'

export const tracksReceiverChats = pgTable('tracks_receiver_chats', {
    id: integer('id').primaryKey().notNull()
})