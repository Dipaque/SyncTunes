import { localStorage_pinSongs } from "../constants";

/**
 * Toggles the pinned status of a song in localStorage.
 *
 * If the song is already pinned, it will be removed and the `onDelete`
 * callback will be triggered. Otherwise, the song will be added to the
 * pinned songs and the `onInsert` callback will be triggered.
 *
 * The `finalFunc` callback is executed after the operation completes,
 * regardless of whether it succeeds or throws an error.
 *
 * @param {Object} params - Function parameters.
 * @param {Object} params.song - Song object to pin or unpin.
 * @param {string} params.song.id - Unique identifier of the song.
 * @param {string} params.song.title - Song title.
 * @param {string} params.song.image - Song thumbnail/image URL.
 * @param {string} params.song.channelName - Artist or channel name.
 * @param {string} [params.song.artistId] - Unique identifier of the artist.
 * @param {string} [params.song.itemType] - Type of the item.
 * @param {Function} [params.onDelete] - Callback executed when the song is unpinned.
 * @param {Function} [params.onInsert] - Callback executed when the song is pinned.
 * @param {Function} [params.finalFunc] - Callback executed after the operation,
 * regardless of whether it succeeds or fails.
 *
 * @returns {void}
 */
const handlePin = ({ song, onDelete, onInsert, finalFunc }) => {

    const PIN_LIMIT = 8

  try {
    const lookup =
      JSON.parse(localStorage.getItem(localStorage_pinSongs)) || {};

    const { id, title, image, channelName, artistId, itemType } = song;

    if (lookup[id]) {
      // If it exists, delete it (Unpin)
      delete lookup[id];

      // Trigger on delete if exists
      onDelete && onDelete();
    } else {
      // If it doesn't exist, save it (Pin)
      lookup[id] = {
        id,
        title,
        image,
        channelName,
        artistId,
        type: itemType
      };

      const pinnedSongs = Object.values(lookup)

      if(pinnedSongs?.length > PIN_LIMIT){
        const firstIndex = pinnedSongs[0]?.id

        delete lookup[firstIndex] // Pop first pin if exceed more than limit.
      }

      // Trigger on insert if exists
      onInsert && onInsert();
    }

    localStorage.setItem(
      localStorage_pinSongs,
      JSON.stringify(lookup)
    );
  } catch (error) {
    console.error("Failed to toggle pin status:", error);
  } finally {
    finalFunc && finalFunc();
  }
};

export default handlePin;