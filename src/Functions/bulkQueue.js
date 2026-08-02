import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

/**
 * Updates the song playlist `currentSong`
 * 
 * @function bulkQueue
 * 
 * @typedef song
 * @property {string} image - thumbnail of the song (or) song banner
 * @property {string} title - song name
 * @property {string} id - videoId
 * @property {string} channelName - artist name or youtube channel name
 * @property {string} artistId - artist id
 * @property {string} playedBy - player name of the room
 * 
 * @param {song[]} queuedSongs - existing songs in the playlist
 * @param {song[]} newSongs - new songs need to be queued 
 */
const bulkQueue=async({queuedSongs, newSongs})=>{
    if(queuedSongs){
        queuedSongs.splice(queuedSongs.length,0,...newSongs)
        await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[...queuedSongs]}).catch(err=>console.log(err)) 
    }else {
        await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:newSongs}).catch(err=>console.log(err))
    }
    
}
export default bulkQueue
