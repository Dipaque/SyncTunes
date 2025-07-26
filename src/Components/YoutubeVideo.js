import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { db } from "../firebase-config";
import { doc, onSnapshot, updateDoc, Timestamp } from "firebase/firestore";
import { useStateContext } from "../Context/ContextProvider";
import { getUniqueObjectsById } from "../Functions/removeDupes";
const YouTubeVideo = ({ videoIds }) => {
  const intervalRef = useRef(null);
  const [id, setId] = useState("");
  const {
    setOnReady,
    setTitle,
    setArtist,
    setVideoIds,
    currentPlaying,
    setCurrentPlaying,
    setDuration,
    setCurrentTime,
    onReady,
    setPlayedBy,
    setIsLoading,
    isLoading,
    thumbnail,
    setThumbnail,
  } = useStateContext();
  const onVideoEnd = () => {
    if (videoIds?.length > 1) {
      const index = videoIds.findIndex((data) => data.id === currentPlaying.id);
      if (index < videoIds?.length - 1) {
        const uniqueVideoIds = getUniqueObjectsById(videoIds);
        updateDoc(doc(db, "room", sessionStorage.getItem("roomCode")), {
          currentSong: uniqueVideoIds,
          currentPlaying: { ...videoIds[index + 1], playedAt: Timestamp.now() },
        }).catch((err) => console.log(err));
      }
    } else {
      updateDoc(doc(db, "room", sessionStorage.getItem("roomCode")), {
        currentPlaying: { ...videoIds[0], playedAt: Timestamp.now(), },
      }).catch((err) => console.log(err));
    }
    if (onReady) onReady.seekTo(0);
    setCurrentTime(0);
  };
  useEffect(() => {
    // const fetchUsers = async () => {
    //   try {
        const docRef = doc(db, "room", sessionStorage.getItem("roomCode"));
   const unsubscribe =     onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            setVideoIds(doc.data().currentSong);
            if (doc.data().currentPlaying) {
              setCurrentPlaying(doc.data().currentPlaying);
              setId(doc.data().currentPlaying.id);
              setTitle(doc.data().currentPlaying.title);
              setArtist(doc.data().currentPlaying.channelName);
              setPlayedBy(doc.data().currentPlaying.playedBy);
              setThumbnail(doc?.data()?.currentPlaying.image);
            }
          }
        });
      // } catch (err) {
      //   console.log(err);
      // }
    // };
    // fetchUsers();
    return () => unsubscribe();
  }, [videoIds]);

  const onReadyFunc = (event) => {
    setOnReady(event.target);
    setDuration(event.target.getDuration());
    setIsLoading(false);
  };
  const opts = {
    height: "30",
    width: "30",
    playerVars: {
      autoplay: 1,
      fs: 0,
      rel: 0,
      showinfo: 0,
      loop: 1,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      showRelatedVideos: 0,
    },
  };
  const onStateChange = (event) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      startInterval();
    } else {
      clearInterval(intervalRef.current);
    }
  };

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentTime((prevCurrentTime) => {
        const newCurrentTime = onReady.getCurrentTime();
        if (Math.abs(newCurrentTime - prevCurrentTime) > 1) {
          return newCurrentTime;
        }
        return prevCurrentTime;
      });
    }, 500);
  };

  return (
    <div>
      {(id || !isLoading || thumbnail ) && (
        <>
          <div
            style={{ position: "absolute", bottom: 0, left: -42, zIndex: -1 }}
          >
            <YouTube
              videoId={id}
              className=""
              opts={opts}
              onReady={onReadyFunc}
              onStateChange={onStateChange}
              onEnd={onVideoEnd}
            />
          </div>
        </>
      )}
    </div>
  );
};
export default YouTubeVideo;
