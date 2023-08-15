import { createClient } from '@supabase/supabase-js'

const privateKey = process.env['SUPABASE_PRIVATE_KEY']

if(!privateKey) {
    throw new Error('Environment variable \'SUPABASE_PRIVATE_KEY\' was not provided')
}

export const supabase = createClient('https://xytxrtedkqkrassabqyo.supabase.co', privateKey)