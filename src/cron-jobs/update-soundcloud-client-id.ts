import { getSoundcloudClientId } from 'soundcloud-client-id-generator'
import { clientId, setClientId } from '../soundcloud-api.js'

export async function updateSoundcloudClientId() {
    try {
        setClientId(await getSoundcloudClientId())
        console.log('new client id ' + clientId)
    }
    catch(error) {
        console.log('error while getting client id: ' + error)
    }
}