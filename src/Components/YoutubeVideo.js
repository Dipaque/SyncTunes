import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { db } from "../firebase-config";
import { doc, onSnapshot, updateDoc, Timestamp } from "firebase/firestore";
import { useStateContext } from "../Context/ContextProvider";
import { getUniqueObjectsById } from "../Functions/removeDupes";
import apiClient from "../utils/apiClient";
import { localStorage_autoSuggest } from "../constants";
import bulkQueue from "../Functions/bulkQueue";

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
    setCurrentTime, // We will use this to forcefully reset time
    onReady,
    setPlayedBy,
    setIsLoading,
    isLoading,
    thumbnail,
    setThumbnail,
    setIsPause
  } = useStateContext();

  // 🐛 FIX 1: Immediately clear interval and reset time when track ID changes
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentTime(0);
  }, [id, setCurrentTime]);

  const onVideoEnd = async () => {
    const index = videoIds.findIndex((data) => data.id === currentPlaying.id);
    const autoSuggest = JSON.parse(localStorage.getItem(localStorage_autoSuggest)); // get settings value
    
    // Check if the currently ending song is the absolute last song in the array
    const isLastSong = index === videoIds?.length - 1;
  
    try {
      if (!isLastSong) {
        // 1. NOT the last song: Simply play the next song in the queue
        const uniqueVideoIds = getUniqueObjectsById(videoIds);
        await updateDoc(doc(db, "room", sessionStorage.getItem("roomCode")), {
          currentSong: uniqueVideoIds,
          currentPlaying: { ...videoIds[index + 1], playedAt: Timestamp.now() },
        });
  
      } else {
        // 2. IS the last song: Check if Auto-Suggest is enabled
        if (autoSuggest) {
          // AWAIT the api call (apiClient already knows the base URL)
          const { data } = await apiClient.get(`/song/${id}/up-next`);
            
          if (data && data.length > 0) {
            // Queue all the fetched results
            const suggestedSongs = data?.slice(0, data?.length / 2); // slice from 0 - 20 max
            
            const refactoredSongs = suggestedSongs.map((song) => {
              return {
                // Fixed typo: changed song.thumbnail to song.thumbnails for the array fallback
                image: song?.thumbnail || song?.thumbnails?.[song?.thumbnails?.length - 1]?.url || "",
                title: song?.title || "Unknown Title",
                id: song?.videoId || "",
                // Fallback to null because Firestore blocks 'undefined'
                artistId: song?.artists?.artistId || null, 
                channelName: song?.artists || song?.artist?.name || "Unknown Artist",
                playedBy: "Auto Suggest"
              }
            });
            
            // Queue the suggest songs in the playlist
            await bulkQueue({ queuedSongs: videoIds, newSongs: refactoredSongs });
  
            // Force the player to immediately start playing the FIRST suggested song
            await updateDoc(doc(db, "room", sessionStorage.getItem("roomCode")), {
              currentPlaying: {
                id: refactoredSongs[0].id,
                title: refactoredSongs[0].title,
                image: refactoredSongs[0].image,
                channelName: refactoredSongs[0].channelName,
                playedBy: "Auto Suggest",
                playedAt: Timestamp.now()
              }
            });
          }
        } else {
          // 3. IS the last song, but Auto-Suggest is OFF: Loop back to the very first song
          await updateDoc(doc(db, "room", sessionStorage.getItem("roomCode")), {
            currentPlaying: { ...videoIds[0], playedAt: Timestamp.now() },
          });
        }
      }
    } catch (err) {
      console.error("Error handling track change / auto-suggest:", err);
    }
  
    // Reset the local player time
    // if (onReady) onReady.seekTo(0);
    setCurrentTime(0);
  };

  useEffect(() => {
    let unsubscribe;
    const fetchUsers = async () => {
      try {
        const docRef = doc(db, "room", sessionStorage.getItem("roomCode"));
        unsubscribe = onSnapshot(docRef, (doc) => {
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
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
    return () => unsubscribe();
  }, [videoIds]); // Warning: Having videoIds as a dependency here might cause too many re-renders. Consider removing it or changing to roomCode.

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
    // 🐛 FIX 2: Only start interval if video is playing AND it's not buffering a new track
    if (event.data === YouTube.PlayerState.PLAYING) {
      setIsPause(false);
      // Ensure we have the new video's duration before setting interval
      setDuration(event.target.getDuration()); 
      startInterval();
    } else {
      setIsPause(true);
      clearInterval(intervalRef.current);
    }
  };

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (onReady && typeof onReady.getCurrentTime === 'function') {
        const newCurrentTime = onReady.getCurrentTime();
        setCurrentTime(newCurrentTime);
      }
    }, 500);
  };

  return (
    <div>
      {(id || !isLoading || thumbnail ) && (
        <>
          <div style={{ position: "absolute", bottom: 0, left: -42, zIndex: -1 }}>
            <YouTube
              key={id} // 🐛 FIX: This forces React to unmount the old player and mount a fresh one on track change
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