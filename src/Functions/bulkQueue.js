import { localStorage_soloQueue, PLAYER_MODE } from "../constants";
import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

/**
 * Updates the song playlist `currentSong` with multiple new songs at once.
 * Safely handles both Solo Mode (localStorage) and Jam Mode (Firebase).
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
 * @param {Object} params - The parameters object
 * @param {song[]} params.queuedSongs - existing songs in the playlist
 * @param {song[]} params.newSongs - new songs need to be queued 
 * @param {string} params.playerMode - Global state indicating SOLO or JAM mode
 * @param {Function} [params.setVideoIds] - React state setter for the queue (required for Solo mode)
 */
const bulkQueue = async ({ queuedSongs, newSongs, playerMode, setVideoIds, setSongsList }) => {
  const isSolo = playerMode === PLAYER_MODE.SOLO;

  try {
    // SCENARIO 1: Queue already exists
    if (queuedSongs && queuedSongs.length > 0) {
      // Combine arrays cleanly without mutating the original React state array
      const updatedQueue = [...queuedSongs, ...newSongs];

      if (isSolo) {
        // --- SOLO MODE ---
        localStorage.setItem(localStorage_soloQueue, JSON.stringify(updatedQueue));
        if (setVideoIds) setVideoIds(updatedQueue);
      } else {
        // --- JAM MODE ---
        const roomCode = sessionStorage.getItem('roomCode');
        if (roomCode) {
          await updateDoc(doc(db, 'room', roomCode), { 
            currentSong: updatedQueue 
          });
        }
      }
      
    // SCENARIO 2: Queue is completely empty
    } else {
      if (isSolo) {
        // --- SOLO MODE ---
        localStorage.setItem(localStorage_soloQueue, JSON.stringify(newSongs));
        if (setVideoIds) setVideoIds(newSongs);
        if (setSongsList) setSongsList(newSongs);
      } else {
        // --- JAM MODE ---
        const roomCode = sessionStorage.getItem('roomCode');
        if (roomCode) {
          await updateDoc(doc(db, 'room', roomCode), { 
            currentSong: newSongs 
          });
        }
      }
    }
  } catch (err) {
    console.error("Failed to bulk queue songs:", err);
  }
};

export default bulkQueue;
