import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { db } from "../firebase-config";
import { doc, onSnapshot, updateDoc, Timestamp } from "firebase/firestore";
import { useStateContext } from "../Context/ContextProvider";
import { getUniqueObjectsById } from "../Functions/removeDupes";
import apiClient from "../utils/apiClient";
import { 
  localStorage_autoSuggest, 
  localStorage_autoSuggestLimit,
  localStorage_currentPlaying,
  localStorage_fadeDuration,
  localStorage_pastSongsLimit,
  localStorage_soloQueue,
  PLAYER_MODE
} from "../constants";

/**
 * YouTubeVideo Component
 * Handles the hidden iframe player, track progression, auto-suggest, and volume fading.
 * Safely routes logic between Local Storage (Solo Mode) and Firebase (Jam Mode).
 * 
 * @param {Object} props
 * @param {Array} props.videoIds - The current queue of songs (fallback if context isn't used)
 */
const YouTubeVideo = ({ videoIds: propVideoIds }) => {
  const intervalRef = useRef(null);
  const isFirstLoad = useRef(true); // 🐛 NEW: Track initial app load
  const [id, setId] = useState("");
  
  const {
    setOnReady,
    setTitle,
    setArtist,
    videoIds: contextVideoIds, 
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
    setIsPause,
    playerMode 
  } = useStateContext();

  const activeVideoIds = contextVideoIds?.length > 0 ? contextVideoIds : propVideoIds;
  const isSolo = playerMode === PLAYER_MODE.SOLO;

  // ----------------------------------------------------------------------
  // 1. HYDRATION & SYNC (Protects against page refreshes in Solo Mode)
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (isSolo) {
      const localPlaying = JSON.parse(localStorage.getItem(localStorage_currentPlaying));
      const localQueue = JSON.parse(localStorage.getItem(localStorage_soloQueue));

      if (localPlaying && !currentPlaying?.id) {
        setCurrentPlaying(localPlaying);
        setIsPause(true);
      }
      if (localQueue && (!activeVideoIds || activeVideoIds.length === 0)) {
        setVideoIds(localQueue);
      }

      if (currentPlaying) {
        setId(currentPlaying.id);
        setTitle(currentPlaying.title);
        setArtist(currentPlaying.channelName);
        setPlayedBy(currentPlaying.playedBy || "Solo Player");
        setThumbnail(currentPlaying.image || currentPlaying.thumbnail);
      }
    }
  }, [isSolo, currentPlaying, activeVideoIds, setCurrentPlaying, setVideoIds, setTitle, setArtist, setPlayedBy, setThumbnail, setIsPause]);

  // ----------------------------------------------------------------------
  // 2. FIREBASE LISTENER (Only active in Jam Mode)
  // ----------------------------------------------------------------------
  useEffect(() => {
    let unsubscribe;
    
    const fetchUsers = async () => {
      if (isSolo) return; 

      const roomCode = sessionStorage.getItem("roomCode");
      if (!roomCode) return;

      try {
        const docRef = doc(db, "room", roomCode);
        unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setVideoIds(data.currentSong || []);
            
            if (data.currentPlaying) {
              setCurrentPlaying(data.currentPlaying);
              setId(data.currentPlaying.id);
              setTitle(data.currentPlaying.title);
              setArtist(data.currentPlaying.channelName);
              setPlayedBy(data.currentPlaying.playedBy);
              setThumbnail(data.currentPlaying.image);
            }
          }
        });
      } catch (err) {
        console.error("Firebase sync error:", err);
      }
    };

    fetchUsers();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isSolo, setVideoIds, setCurrentPlaying, setTitle, setArtist, setPlayedBy, setThumbnail]);

  // ----------------------------------------------------------------------
  // 3. TRACK PROGRESSION & AUTO-SUGGEST
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentTime(0);
  }, [id, setCurrentTime]);

  const onVideoEnd = async () => {
    if (!activeVideoIds || activeVideoIds.length === 0 || !currentPlaying) return;
  
    const index = currentPlaying.queueIndex !== undefined 
      ? currentPlaying.queueIndex 
      : activeVideoIds.findIndex((data) => data.id === currentPlaying.id);
      
    const autoSuggest = JSON.parse(localStorage.getItem(localStorage_autoSuggest));
    const isLastSong = index === activeVideoIds.length - 1;
    const roomCode = sessionStorage.getItem("roomCode");
  
    try {
      if (!isLastSong) {
        // ==========================================
        // SCENARIO 1: MOVING TO NEXT EXISTING SONG
        // ==========================================
        if (isSolo) {
          let nextIndex = index + 1;
          let updatedQueue = [...activeVideoIds];
          
          // APPLY PAST SONG LIMIT
          const pastSongLimit = parseInt(localStorage.getItem(localStorage_pastSongsLimit)) || 10;
          if (nextIndex > pastSongLimit) {
            const amountToTrim = nextIndex - pastSongLimit;
            updatedQueue = updatedQueue.slice(amountToTrim);
            nextIndex = pastSongLimit; // Shift index backward
            
            setVideoIds(updatedQueue);
            localStorage.setItem(localStorage_soloQueue, JSON.stringify(updatedQueue));
          }

          const nextSong = { 
            ...updatedQueue[nextIndex], 
            queueIndex: nextIndex,
            playedAt: Timestamp.now() 
          };

          setCurrentPlaying(nextSong);
          localStorage.setItem(localStorage_currentPlaying, JSON.stringify(nextSong));
        } else {
          // --- JAM MODE ---
          const nextSong = { 
            ...activeVideoIds[index + 1], 
            queueIndex: index + 1,
            playedAt: Timestamp.now() 
          };
          const uniqueVideoIds = getUniqueObjectsById(activeVideoIds);
          await updateDoc(doc(db, "room", roomCode), {
            currentSong: uniqueVideoIds,
            currentPlaying: nextSong,
          });
        }
  
      } else {
        // ==========================================
        // SCENARIO 2: AUTO-SUGGESTING NEW SONGS
        // ==========================================
        if (isSolo) {
          if (autoSuggest) {
            const { data } = await apiClient.get(`music/song/${currentPlaying.id}/up-next`);
              
            if (data && data.length > 0) {
              const suggestionLimit = localStorage.getItem(localStorage_autoSuggestLimit) || 5;
              const limit = Math.min(suggestionLimit, data.length - 1);
              
              const refactoredSongs = data.slice(0, limit).map((song) => ({
                image: song?.thumbnail || song?.thumbnails?.[song?.thumbnails?.length - 1]?.url || "",
                title: song?.title || "Unknown Title",
                id: song?.videoId || "",
                artistId: song?.artists?.artistId || null, 
                channelName: song?.artists || song?.artist?.name || "Unknown Artist",
                playedBy: "Auto Suggest"
              }));
              
              let updatedQueue = [...activeVideoIds, ...refactoredSongs];
              let nextIndex = activeVideoIds.length; // The index of the first suggested song
              
              // APPLY PAST SONG LIMIT TO NEWLY APPENDED QUEUE
              const pastSongLimit = parseInt(localStorage.getItem(localStorage_pastSongsLimit)) || 10;
              if (nextIndex > pastSongLimit) {
                const amountToTrim = nextIndex - pastSongLimit;
                updatedQueue = updatedQueue.slice(amountToTrim);
                nextIndex = pastSongLimit; // Shift index backward
              }

              // Update Queue States
              setVideoIds(updatedQueue);
              localStorage.setItem(localStorage_soloQueue, JSON.stringify(updatedQueue));
              
              // Format and Set the New Playing Song
              const firstSuggestedSong = { 
                ...updatedQueue[nextIndex], 
                queueIndex: nextIndex,
                playedAt: Timestamp.now() 
              };
  
              setCurrentPlaying(firstSuggestedSong);
              localStorage.setItem(localStorage_currentPlaying, JSON.stringify(firstSuggestedSong));
            }
          } else {
            setIsPause(true);
            setCurrentTime(0);
          }
        } else {
          // --- JAM MODE END OF QUEUE ---
          setIsPause(true);
          setCurrentTime(0);
          
          await updateDoc(doc(db, "room", roomCode), {
            isPause: true
          });
        }
      }
    } catch (err) {
      console.error("Error handling track change:", err);
    }
  };

  // ----------------------------------------------------------------------
  // 4. PLAYER ENGINE & EVENT HANDLERS
  // ----------------------------------------------------------------------
  const onReadyFunc = (event) => {
    setOnReady(event.target);
    setDuration(event.target.getDuration());
    setIsLoading(false);
    event.target.setVolume(100); 

    // Ensure state remains paused if this was the initial load
    if (isSolo && isFirstLoad.current) {
      setIsPause(true);
    }

    // Set first load to false so all subsequent song changes autoplay correctly
    isFirstLoad.current = false; 
  };

  const opts = {
    height: "30",
    width: "30",
    playerVars: {
      // Turn off autoplay strictly for the very first load in Solo Mode
      autoplay: (isSolo && isFirstLoad.current) ? 0 : 1, 
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
      setIsPause(false);
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
      try {
        if (onReady && typeof onReady.getCurrentTime === 'function' && onReady.getIframe()) {
          const newCurrentTime = onReady.getCurrentTime();
          const currentDuration = onReady.getDuration();
          
          setCurrentTime(newCurrentTime);

          const savedFade = localStorage.getItem(localStorage_fadeDuration);
          const fadeDuration = savedFade !== null ? parseInt(savedFade, 10) : 5;
          const timeRemaining = currentDuration - newCurrentTime;

          if (timeRemaining <= fadeDuration && timeRemaining > 0) {
            const targetVolume = Math.floor((timeRemaining / fadeDuration) * 100);
            onReady.setVolume(targetVolume);
          }
        } else {
          clearInterval(intervalRef.current);
        }
      } catch (err) {
        console.warn("Interval cleared: YouTube player instance invalid.");
        clearInterval(intervalRef.current);
      }
    }, 500);
  };

  return (
    <div>
      {(id || !isLoading || thumbnail ) && (
        <div style={{ position: "absolute", bottom: 0, left: -42, zIndex: -1 }}>
          <YouTube
            key={currentPlaying?.id} 
            videoId={currentPlaying?.id}
            opts={opts}
            onReady={onReadyFunc}
            onStateChange={onStateChange}
            onEnd={onVideoEnd}
          />
        </div>
      )}
    </div>
  );
};

export default YouTubeVideo;