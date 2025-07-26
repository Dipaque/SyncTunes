import React, { useEffect, useState } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoHeart } from "react-icons/io5";
import { useStateContext } from "../Context/ContextProvider";
import { fetchSongsList } from "../Functions/fetchSongsList";
import Cookies from "js-cookie";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";

const LikeSong = ({ iconSize, color }) => {
  const [liked, setLiked] = useState(false);
  const [animate, setAnimate] = useState(false);
  const { currentPlaying, setSongsList, songsList } = useStateContext();
  const roomCode = sessionStorage.getItem("roomCode");

  const email = Cookies.get("email");

  useEffect(() => {
    const fetchIsLiked = async () => {
      if (!currentPlaying?.id || !email) return;

      try {
        const songsList = await fetchSongsList();
        const currentSong = songsList.find(
          (song) => song.id === currentPlaying.id
        );

        if (currentSong && Array.isArray(currentSong.likedBy)) {
          const isLiked = currentSong.likedBy.some(
            (user) => user.email === email
          );
          setLiked(isLiked);
        } else {
          setLiked(false);
        }
      } catch (err) {
        console.error("Error checking liked status:", err);
        setLiked(false);
      }
    };

    fetchIsLiked();
  }, [currentPlaying]);

  const handleClick = async (e, isLiked) => {
    e.stopPropagation();
    setLiked(!liked);
    setAnimate(true);
    const userId = Cookies.get("uid")
    const userRef = doc(db,"users",userId);
    const songsList = await fetchSongsList();
    const likedSongs = (await getDoc(userRef)).data()?.likedSongs
    const currentSong = songsList.map((song) => {
      if (song.id === currentPlaying.id && (!song.likedBy || song.likedBy.length<=0)) {
        const likedBy = isLiked
          ? [
              {
                email: Cookies.get("email"),
                avatar: Cookies.get("photoUrl"),
              },
            ]
          : null;
        return {
          ...song,
          likedBy: likedBy,
          totalLikes: isLiked ? 1 : 0,
        };
      } else if (song.id === currentPlaying.id && song.likedBy?.length > 0) {
        let likedBy;

  if (isLiked) {
    likedBy = [
      ...song.likedBy,
      {
        email: Cookies.get("email"),
        avatar: Cookies.get("photoUrl"),
      },
    ];
  } else {
    likedBy = song.likedBy.filter(
      (user) => user.email !== Cookies.get("email")
    );
  }
        return {
          ...song,
          likedBy: likedBy,
          totalLikes: likedBy?.length ?? 0,
        };
      } else {
        return {
          ...song,
        };
      }
    });
    let updatedLikedSongs = []
    if(!likedSongs && isLiked){
      updatedLikedSongs = [
          {
            ...currentPlaying,
            createdAt:Timestamp.now()

          }
        ]
    }else if(likedSongs?.length>0 && isLiked){
      updatedLikedSongs=[
        ...likedSongs,
        {
          ...currentPlaying,
          createdAt:Timestamp.now()

        }
      ]
    }else{
      updatedLikedSongs= likedSongs.filter((song)=>song.id!==currentPlaying.id)
    }
    await updateDoc(doc(db,"users",userId),{likedSongs:updatedLikedSongs})
    await updateDoc(doc(db, "room", roomCode), { currentSong });
    setTimeout(() => setAnimate(false), 300);
  };
  return (
    <React.Fragment>
      {!liked ? (
        <IoIosHeartEmpty
          className="heart-container animate"
          onClick={(e) => handleClick(e, true)}
          size={iconSize}
          cursor={"pointer"}
          color={color}
        />
      ) : (
        <IoHeart
          className={`heart-icon ${animate ? "animate" : ""}`}
          style={{ color: liked ? "#F91880" : "" }}
          onClick={(e) => handleClick(e, false)}
          size={iconSize}
          cursor={"pointer"}
        />
      )}
    </React.Fragment>
  );
};

export default LikeSong;
