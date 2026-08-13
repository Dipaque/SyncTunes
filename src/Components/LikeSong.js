import React, { useEffect, useState } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoHeart } from "react-icons/io5";
import { useStateContext } from "../Context/ContextProvider";
import { fetchSongsList } from "../Functions/fetchSongsList";
import Cookies from "js-cookie";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { PLAYER_MODE } from "../constants";

const LikeSong = ({ iconSize, color }) => {
  const [liked, setLiked] = useState(false);
  const [animate, setAnimate] = useState(false);
  const { currentPlaying, playerMode } = useStateContext();
  const roomCode = sessionStorage.getItem("roomCode");

  const email = Cookies.get("email");
  const userId = Cookies.get("uid");

  // 1. CHECK LIKED STATUS ON MOUNT / SONG CHANGE
  useEffect(() => {
    const fetchIsLiked = async () => {
      if (!currentPlaying?.id || !email || !userId) return;

      try {
        if (playerMode === PLAYER_MODE.SOLO) {
          // --- SOLO MODE: Check user's personal collection ---
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const likedSongs = userSnap.data()?.likedSongs || [];
            const isLiked = likedSongs.some((song) => song.id === currentPlaying.id);
            setLiked(isLiked);
          }
        } else {
          // --- JAM MODE: Check the room's current queue state ---
          const songsList = await fetchSongsList();
          const currentSong = songsList.find((song) => song.id === currentPlaying.id);

          if (currentSong && Array.isArray(currentSong.likedBy)) {
            const isLiked = currentSong.likedBy.some((user) => user.email === email);
            setLiked(isLiked);
          } else {
            setLiked(false);
          }
        }
      } catch (err) {
        console.error("Error checking liked status:", err);
        setLiked(false);
      }
    };

    fetchIsLiked();
  }, [currentPlaying, playerMode, userId, email, liked]);


  // 2. HANDLE LIKE/UNLIKE ACTIONS
  const handleClick = async (e, isLiked) => {
    e.stopPropagation();
    
    if (!userId) return;

    const userRef = doc(db, "users", userId);

    try {
      // --- ALWAYS UPDATE USER'S PERSONAL COLLECTION ---
      const userSnap = await getDoc(userRef);
      const likedSongs = userSnap.data()?.likedSongs || [];
      let updatedLikedSongs = [];

      if (isLiked) {
        // Add to collection if not already there
        const alreadyExists = likedSongs.some((song) => song.id === currentPlaying.id);
        if (!alreadyExists) {
          updatedLikedSongs = [
            ...likedSongs,
            {
              ...currentPlaying,
              createdAt: Timestamp.now()
            }
          ];
        } else {
          updatedLikedSongs = likedSongs;
        }
      } else {
        // Remove from collection
        updatedLikedSongs = likedSongs.filter((song) => song.id !== currentPlaying.id);
      }

      await updateDoc(userRef, { likedSongs: updatedLikedSongs });


      // --- ONLY UPDATE ROOM IF IN JAM MODE ---
      if (playerMode !== PLAYER_MODE.SOLO && roomCode) {
        const songsList = await fetchSongsList();
        
        const updatedQueue = songsList.map((song) => {
          if (song.id === currentPlaying.id) {
            let currentLikedBy = song.likedBy || [];
            
            if (isLiked) {
              // Add user to song's likedBy array
              const userExists = currentLikedBy.some((user) => user.email === email);
              if (!userExists) {
                currentLikedBy = [
                  ...currentLikedBy, 
                  { email: email, avatar: Cookies.get("photoUrl") }
                ];
              }
            } else {
              // Remove user from song's likedBy array
              currentLikedBy = currentLikedBy.filter((user) => user.email !== email);
            }

            return {
              ...song,
              likedBy: currentLikedBy,
              totalLikes: currentLikedBy.length,
            };
          }
          return song;
        });

        await updateDoc(doc(db, "room", roomCode), { currentSong: updatedQueue });
      }
    } catch (error) {
      console.error("Failed to update liked status:", error);
      // Optional: Revert optimistic UI update here if network fails
    }
    finally {
       // Optimistic UI update + Instagram Bounce Animation
    setLiked(isLiked);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300); // 300ms matches the CSS transition duration
    }
  };

  // Base styling for the Instagram Pop effect
  const animationClasses = `transform transition-transform duration-300 ease-in-out active:scale-75 ${
    animate ? "scale-125" : "scale-100"
  }`;

  return (
    <React.Fragment>
      {!liked ? (
        <IoIosHeartEmpty
          className={animationClasses}
          onClick={(e) => handleClick(e, true)}
          size={iconSize}
          cursor={"pointer"}
          color={color}
        />
      ) : (
        <IoHeart
          className={animationClasses}
          style={{ color: "#F91880" }} // Vibrant Instagram/Twitter Pink
          onClick={(e) => handleClick(e, false)}
          size={iconSize}
          cursor={"pointer"}
        />
      )}
    </React.Fragment>
  );
};

export default LikeSong;