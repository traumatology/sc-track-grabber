import { drizzle } from 'drizzle-orm/postgres-js'
import dotenv from 'dotenv'
import postgres from 'postgres'
import * as artistsSchema from './schemas/artists.js'
import * as tracksSchema from './schemas/tracks.js'

dotenv.config()

const connectionURI = process.env.DB_CONNECTION_URI

if(!connectionURI) {
    throw new Error('Environment variable \'DB_CONNECTION_URI\' was not provided')
}

const client = postgres(connectionURI)
export const db = drizzle(client, { schema: { ...artistsSchema, ...tracksSchema } })