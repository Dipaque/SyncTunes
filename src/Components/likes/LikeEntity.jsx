import React, { useEffect, useState } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoHeart } from "react-icons/io5";
import Cookies from "js-cookie";
import apiClient from "../../utils/apiClient";
import { library_route } from "../../constants";


const LikeEntity = ({ id, type, iconSize = 28, color = "white", songInfo }) => {
  const [liked, setLiked] = useState(false);
  const [animate, setAnimate] = useState(false);
  const userId = Cookies.get("uid");

  // Determine which array to check based on the entity type
  const getArrayName = () => {
    switch (type) {
      case "artist": return "likedArtists";
      case "album": return "likedAlbums";
      case "playlist": return "likedPlaylists";
      case "song" : return "likedSongs"
      default: return "";
    }
  };

  const fetchLikeStatus = async () => {
    if (!userId || !id || !type) return;

    try {
      // Fetch the unified library to check if this specific ID exists
      const res = await apiClient.post(`${library_route}/all`, { userId });
      const arrayName = getArrayName();
      
      if (res.data && res.data[arrayName]) {
        const isLiked = res.data[arrayName].some((item) => item.id === id);
        setLiked(isLiked);
      }
    } catch (err) {
      console.error(`Error fetching ${type} like status:`, err);
    }
  };
  useEffect(() => {

    fetchLikeStatus();
  }, [id, type, userId]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!userId) return;

    const newLikedState = !liked;
    
    // Optimistic UI Update with Instagram-style pop animation
    setLiked(newLikedState);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    try {
      await apiClient.post(`${library_route}/like-entity`, {
        userId,
        id,
        type, // 'artist', 'album', or 'playlist'
        isLiked: newLikedState,
        artistId: songInfo?.artistId, 
        channelName: songInfo?.channelName,
        title:songInfo?.title, 
        image: songInfo?.image
      });

    // refetch the liked song to update
    fetchLikeStatus()
    } catch (error) {
      console.error(`Failed to update ${type} like status:`, error);
      // Revert optimistic UI on failure
      setLiked(!newLikedState);
    }
  };

  const animationClasses = `transform transition-transform duration-300 ease-in-out active:scale-75 ${
    animate ? "scale-125" : "scale-100"
  }`;

  return (
    <div className="flex items-center justify-center p-2">
      {!liked ? (
        <IoIosHeartEmpty
          className={animationClasses}
          onClick={handleClick}
          size={iconSize}
          cursor="pointer"
          color={color}
        />
      ) : (
        <IoHeart
          className={animationClasses}
          style={{ color: "#F91880" }} // Vibrant Pink
          onClick={handleClick}
          size={iconSize}
          cursor="pointer"
        />
      )}
    </div>
  );
};

export default LikeEntity;