import { localStorage_pinSongs } from "../constants";

/**
 * 
 * @param {*} param0 
 */
const handlePin = ({id, title, image, channelName, artistId, itemType}) => {
    try {
        const lookup = JSON.parse(localStorage.getItem(localStorage_pinSongs)) || {};
        
        if (lookup[id]) {
          // If it exists, delete it (Unpin)
          delete lookup[id];
        } else {
          // If it doesn't exist, save it (Pin)
          // We save all relevant props so it renders correctly on the Home screen
          lookup[id] = { id, title, image, channelName, artistId, type: itemType };
        }
        
        localStorage.setItem(localStorage_pinSongs, JSON.stringify(lookup));
      } catch (error) {
        console.error("Failed to toggle pin status:", error);
      }
}

export default handlePin;