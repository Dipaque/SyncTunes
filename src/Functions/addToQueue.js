import { localStorage_currentPlaying, localStorage_soloQueue, PLAYER_MODE } from "../constants";
import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

/**
 * Adds a song to the very end of the queue.
 * 
 * @param {string} image - Song thumbnail URL
 * @param {string} title - Song title
 * @param {string} id - YouTube Video ID
 * @param {string} channelName - Artist/Channel name
 * @param {Array} songs - The current queue of songs (videoIds state)
 * @param {string} name - Name of the user adding the song
 * @param {string} artistId - Optional ID for the artist
 * @param {string} playerMode - Global state indicating SOLO or JAM mode
 * @param {Function} setVideoIds - React state setter for the queue
 * @param {Function} setCurrentPlaying - React state setter for the current song
 */
const addToQueue = async (
  image, 
  title, 
  id, 
  channelName, 
  songs, 
  name, 
  artistId = "", 
  playerMode, 
  setVideoIds,         // ⚠️ NEW: Pass this from component
  setCurrentPlaying    // ⚠️ NEW: Pass this from component
) => {
    debugger;
  const isSolo = playerMode === PLAYER_MODE.SOLO;
  const newSong = { image, title, id, channelName, playedBy: name, artistId, queueIndex: songs?.length > 0 ? songs?.length : 0  };

  try {
    // SCENARIO 1: Queue already exists
    if (songs && songs.length > 0) {
      // Append to a fresh copy of the array
      const newSongsQueue = [...songs, newSong];

      if (isSolo) {
        // --- SOLO MODE ---
        localStorage.setItem(localStorage_soloQueue, JSON.stringify(newSongsQueue));
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
      
    // SCENARIO 2: Queue is empty (First song being added)
    } else {
      if (isSolo) {
        // --- SOLO MODE ---
        localStorage.setItem(localStorage_soloQueue, JSON.stringify([newSong]));
        localStorage.setItem(localStorage_currentPlaying, JSON.stringify(newSong));
        
        // Update UI immediately
        if (setVideoIds) setVideoIds([newSong]);
        if (setCurrentPlaying) setCurrentPlaying(newSong);
      } else {
        // --- JAM MODE ---
        const roomCode = sessionStorage.getItem('roomCode');
        if (roomCode) {
          await updateDoc(doc(db, 'room', roomCode), { 
            currentSong: [newSong], 
            currentPlaying: newSong 
          });
        }
      }
    }
  } catch (err) {
    console.error("Failed to add song to queue:", err);
  }
};

export default addToQueue;