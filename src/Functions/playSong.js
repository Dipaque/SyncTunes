import { doc, Timestamp, updateDoc } from "firebase/firestore";
import Cookies from "js-cookie"
import { localStorage_currentPlaying, localStorage_soloQueue } from "../constants";
import { db } from "../firebase-config";

/**
 * Plays a selected track by updating the active queue and current playing state.
 * Automatically handles data persistence for both Solo Mode (localStorage) and Jam Mode (Firestore).
 *
 * @param {Object} params - The configuration object for playing a track.
 * @param {Object} params.track - The metadata of the track to be played.
 * @param {string} params.track.title - The title of the track.
 * @param {string} params.track.id - The unique identifier (e.g., video ID) of the track.
 * @param {string} params.track.image - The URL of the track's thumbnail image.
 * @param {string} params.track.channelName - The name of the artist or channel.
 * @param {string} [params.track.artistId] - The optional unique identifier for the artist.
 * @param {Object} params.stateSetters - React state variables and setter functions from the application context.
 * @param {Array} params.stateSetters.videoIds - The current queue of tracks.
 * @param {Function} params.stateSetters.setVideoIds - Setter function to update the queue.
 * @param {Function} params.stateSetters.setCurrentPlaying - Setter function for the currently active track object.
 * @param {Function} params.stateSetters.setTitle - Setter function for the player UI title.
 * @param {Function} params.stateSetters.setArtist - Setter function for the player UI artist name.
 * @param {Function} params.stateSetters.setPlayedBy - Setter function for the user who queued the track.
 * @param {Function} params.stateSetters.setThumbnail - Setter function for the player UI thumbnail.
 * @param {boolean} params.isSoloMode - Flag determining if the user is playing locally (`true`) or in a synced room (`false`).
 * @param {Function} [params.onSuccess] - Optional callback executed after the track state is successfully updated.
 * @returns {Promise<void>}
 */
const playSong = async ({ track, stateSetters, isSoloMode, onSuccess }) => {
    const { title, id, image, channelName, artistId, queueIndex } = track;
    
    const { 
      videoIds, 
      setVideoIds, 
      setCurrentPlaying, 
      setTitle, 
      setArtist, 
      setPlayedBy, 
      setThumbnail 
    } = stateSetters;
  
    const roomCode = sessionStorage.getItem("roomCode");
  
    const calculatedIndex = queueIndex !== undefined ? queueIndex : (videoIds?.length || 0);

    try {
      const selectedSong = {
        title, 
        id, 
        image, 
        channelName, 
        artistId, 
        queueIndex: calculatedIndex,
        playedBy: Cookies.get('name') || "Solo Player", 
        playedAt: Timestamp.now() 
      };
  
      localStorage.setItem(localStorage_currentPlaying, JSON.stringify(selectedSong));
  
      if (isSoloMode) {
        // Safely parse the queue to prevent runtime crashes
        const savedQueue = localStorage.getItem(localStorage_soloQueue);
        const localQueue = savedQueue && savedQueue !== "undefined" ? JSON.parse(savedQueue) : [];
        
        localStorage.setItem(localStorage_soloQueue, JSON.stringify([...localQueue, selectedSong]));
        
        // Update global context states for UI rendering
        setVideoIds(prev => prev?.length > 0 ? [...prev, selectedSong] : [selectedSong]);
        setCurrentPlaying(selectedSong);
        setTitle(selectedSong.title);
        setArtist(selectedSong.channelName);
        setPlayedBy(selectedSong.playedBy);
        setThumbnail(selectedSong.image);
      } else {
        const newQueue = videoIds?.length > 0 ? [...videoIds, selectedSong] : [selectedSong];
        
        // Push the updated state to the Firestore room document
        if (roomCode) {
          await updateDoc(doc(db, 'room', roomCode), { 
            currentSong: newQueue, 
            currentPlaying: selectedSong 
          });
        }
      }
  
      // Execute the final callback (e.g., closing a drawer, navigating to the player page)
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      console.error("Failed to play track:", err);
    }
  };
  
  export default playSong;