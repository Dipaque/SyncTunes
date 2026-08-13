import { localStorage_soloQueue, PLAYER_MODE } from "../constants";
import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

/**
 * Inserts a song immediately after the currently playing song.
 * 
 * @param {string} image - Song thumbnail URL
 * @param {string} title - Song title
 * @param {string} id - YouTube Video ID
 * @param {string} channelName - Artist/Channel name
 * @param {Array} songs - The current queue of songs (videoIds state)
 * @param {Object} currentPlaying - The currently playing song object
 * @param {string} name - Name of the user adding the song
 * @param {string} artistId - Optional ID for the artist
 * @param {string} playerMode - Global state indicating SOLO or JAM mode
 * @param {Function} setVideoIds - React state setter for the queue
 */
const playNext = async (
  image, 
  title, 
  id, 
  channelName, 
  songs, 
  currentPlaying, 
  name, 
  artistId = "", 
  playerMode, 
  setVideoIds // ⚠️ NEW: Pass this from your component to update React state instantly
) => {
  const isSolo = playerMode === PLAYER_MODE.SOLO;
  
  if (!songs || !currentPlaying) return;

  try {
    const newSong = { image, title, id, channelName, playedBy: name, artistId, queueIndex: songs?.length > 0 ? songs?.length : 0 };
    const index = songs.findIndex(data => data.id === currentPlaying.id);
    
    // Create a strict copy of the array to avoid mutating React state directly
    const newSongsQueue = [...songs];
    newSongsQueue.splice(index + 1, 0, newSong);

    if (isSolo) {
      // --- SOLO MODE ---
      // 1. Update Local Storage
      localStorage.setItem(localStorage_soloQueue, JSON.stringify(newSongsQueue));
      // 2. Update React State instantly
      if (setVideoIds) setVideoIds(newSongsQueue);
      
    } else {
      // --- JAM MODE ---
      const roomCode = sessionStorage.getItem('roomCode');
      if (roomCode) {
        await updateDoc(doc(db, 'room', roomCode), { 
          currentSong: newSongsQueue 
        });
      }
    }
  } catch (err) {
    console.error("Failed to add song to Play Next:", err);
  }
};

export default playNext;