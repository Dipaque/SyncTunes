import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";
import { localStorage_soloQueue, PLAYER_MODE } from "../constants";

/**
 * Shuffles one or multiple songs into the queue.
 * @param {Object} params
 * @param {Array|Object} params.newSongs - A single song object or an array of songs.
 * @param {Array} params.queuedSongs - The current queue (videoIds).
 * @param {string} params.playerMode - "SOLO" or "JAM".
 * @param {Function} params.setVideoIds - State setter for instant UI update.
 */
const shuffle = async ({ newSongs, queuedSongs = [], playerMode, setVideoIds, setSongsList }) => {
  try {
    // 1. Normalize input: Convert a single song object into an array so we can process both cases identically
    const songsToAdd = Array.isArray(newSongs) ? newSongs : [newSongs];
    
    // 2. Create a fresh copy of the existing queue
    const updatedQueue = [...queuedSongs];

    // 3. Insert each new song at a random position
    songsToAdd.forEach((song) => {
      // Math.random() * updatedQueue.length + 1 ensures it inserts at index 1 or greater
      // This protects index 0 just in case the currently playing song is at the top of the array
      const randomIndex = Math.floor(Math.random() * updatedQueue.length + 1);
      updatedQueue.splice(randomIndex, 0, song);
    });

    // 4. Optimistic UI Update (Instant reflection in the drawer)
    if (setVideoIds) {
      setVideoIds(updatedQueue);
    }
    if (setSongsList) setSongsList(updatedQueue);

    // 5. Sync with Backend / LocalStorage
    const isSolo = playerMode === PLAYER_MODE.SOLO;

    if (isSolo) {
      localStorage.setItem(localStorage_soloQueue, JSON.stringify(updatedQueue));
    } else {
      const roomCode = sessionStorage.getItem("roomCode");
      if (roomCode) {
        await updateDoc(doc(db, "room", roomCode), { 
          currentSong: updatedQueue 
        });
      }
    }
  } catch (err) {
    console.error("Failed to shuffle songs into queue:", err);
  }
};

export default shuffle; 