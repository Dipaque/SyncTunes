import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";

// Firebase
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase-config";

// Icons
import {
  IoHeadsetOutline,
  IoPause,
  IoPerson,
  IoPlay,
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoSparkles,
  IoSparklesOutline,
} from "react-icons/io5";
import { HiOutlineShare } from "react-icons/hi";
import { LuSpeaker } from "react-icons/lu";

// Context & Utils
import { useStateContext } from "../Context/ContextProvider";
import { secondsToMinutes, seekBarStyle } from "../Functions/secondsToMinutes";
import { handleShare } from "../Functions/handleShare";
import { autoSuggest, getRoutes, localStorage_currentPlaying, PLAYER_MODE } from "../constants"; 

// Components
import PlayerShimmer from "../Components/PlayerShimmer";
import LikeSong from "../Components/LikeSong";
import QueueDrawer from "../Components/QueueDrawer";
import RoommatesDrawer from "../Components/RoommatesDrawer";
import PlayerHeader from "../Components/PlayerHeader";
import JoinRoom from "../Components/modal/JoinRoom";
import Lyrics from "../Components/player/Lyrics";
import { getPath } from "../utils/getPath";

/**
 * Main Player View Component.
 * Handles both Solo (Local) and Jam (Multiplayer/Firebase) music playback.
 * 
 * @param {Object} props
 * @param {Function} props.updateParamsId - Callback to sync the URL parameter ID with the parent route.
 * @returns {JSX.Element} The rendered Player interface.
 */
const Index = ({ updateParamsId }) => {
  // --- Global State ---
  const {
    videoIds,
    onReady,
    title,
    playedBy,
    artist,
    currentPlaying,
    setCurrentPlaying,
    duration,
    currentTime,
    setCurrentTime,
    setIsSeeking,
    seekBarRef,
    isLoading,
    isPause,
    setIsPause,
    thumbnail,
    isLeaving,
    playerMode,
    setId,
    setTitle,
    setArtist,
    setPlayedBy,
    setThumbnail,
  } = useStateContext();

  // --- Routing & Mode Validation ---
  const { id } = useParams();
  const roomCode = sessionStorage.getItem("roomCode") || id;
  const isSolo = playerMode === PLAYER_MODE.SOLO;
  const ROUTE = getRoutes(isSolo);

  // --- Local State ---
  const [isExternalDevice, setIsExternalDevice] = useState(false);
  const [deviceLabel, setDeviceLabel] = useState("");

  /**
   * Skips to the next track in the queue.
   * Updates local state in Solo mode, or syncs via Firestore in Jam mode.
   */
  const handleForward = async () => {
    try {
      if (!videoIds || !currentPlaying) return;

      // 1. Determine exact index (fixes duplicate loop bug)
      // If we saved the index previously AND the ID still matches (in case a track was deleted), use it.
      // Otherwise, fallback to the standard findIndex.
      let index = currentPlaying.queueIndex !== undefined && videoIds[currentPlaying.queueIndex]?.id === currentPlaying.id
          ? currentPlaying.queueIndex 
          : videoIds.findIndex((data) => data.id === currentPlaying.id);
      
      // Ensure we are not at the end of the queue before forwarding
      if (index !== -1 && index !== videoIds.length - 1) {
        
        // 2. Inject `queueIndex` into the next song payload so we never lose our place
        const nextSong = { 
          ...videoIds[index + 1], 
          playedAt: Timestamp.now(),
          queueIndex: index + 1 // <--- THE FIX
        };

        if (isSolo) {
          setCurrentPlaying(nextSong);
          setId(nextSong.id);
          setTitle(nextSong.title);
          setArtist(nextSong.channelName);
          setPlayedBy(nextSong.playedBy || "Solo Player");
          setThumbnail(nextSong.image || nextSong.thumbnail);
          localStorage.setItem(localStorage_currentPlaying, JSON.stringify(nextSong));
        } else {
          await updateDoc(doc(db, "room", roomCode), {
            currentPlaying: nextSong,
          });
        }
      }
      
      setCurrentTime(0);
    } catch (err) {
      console.error("Failed to skip to next track:", err);
    }
  };

  /**
   * Rewinds to the previous track in the queue.
   */
  const handleBack = async () => {
    try {
      if (!videoIds || !currentPlaying) return;

      // 1. Determine exact index (fixes duplicate loop bug)
      let index = currentPlaying.queueIndex !== undefined && videoIds[currentPlaying.queueIndex]?.id === currentPlaying.id 
          ? currentPlaying.queueIndex 
          : videoIds.findIndex((data) => data.id === currentPlaying.id);
      
      // Ensure we are not at the very first song
      if (index > 0) {
        
        // 2. Inject `queueIndex` into the previous song payload
        const prevSong = { 
          ...videoIds[index - 1], 
          playedAt: Timestamp.now(),
          queueIndex: index - 1 // <--- THE FIX
        };

        if (isSolo) {
          setCurrentPlaying(prevSong);
          setId(prevSong.id);
          setTitle(prevSong.title);
          setArtist(prevSong.channelName);
          setPlayedBy(prevSong.playedBy || "Solo Player");
          setThumbnail(prevSong.image || prevSong.thumbnail);
          localStorage.setItem(localStorage_currentPlaying, JSON.stringify(prevSong));
        } else {
          await updateDoc(doc(db, "room", roomCode), {
            currentPlaying: prevSong,
          });
        }
      } else if (onReady) {
        // Restart the first track if we are already at the beginning
        onReady.seekTo(0);
      }
      
      setCurrentTime(0);
    } catch (err) {
      console.error("Failed to skip to previous track:", err);
    }
  };

  /**
   * Pauses the currently playing YouTube iframe video.
   */
  const handlePause = () => {
    try {
      // Check if player exists, has the function, AND the iframe is still in the DOM
      if (onReady && typeof onReady.pauseVideo === 'function' && onReady.getIframe()) {
        onReady.pauseVideo();
        setIsPause(true);
      }
    } catch (err) {
      console.warn("Ignored pause: YouTube player already unmounted.", err);
    }
  };

  /**
   * Resumes playback of the YouTube iframe video.
   */
  const handlePlay = () => {
    try {
      if (onReady && typeof onReady.playVideo === 'function' && onReady.getIframe()) {
        onReady.playVideo();
        setIsPause(false);
      }
    } catch (err) {
      console.warn("Ignored play: YouTube player already unmounted.", err);
    }
  };

  /**
   * Temporarily halts progress bar updates while the user is actively dragging the slider.
   */
  const handleMouseDown = () => setIsSeeking(true);
  const handleMouseUp = () => setIsSeeking(false);

  /**
   * Calculates the new time position based on click coordinates and updates the player.
   * @param {React.MouseEvent} event - The click event on the seek bar.
   */
  const handleSeek = (event) => {
    try {
      const seekBar = seekBarRef?.current ?? event.currentTarget;
      if (seekBar && onReady && typeof onReady.seekTo === 'function' && onReady.getIframe()) {
        const seekBarWidth = seekBar.offsetWidth;
        const offsetX = event.nativeEvent.offsetX;
        const seekToTime = (offsetX / seekBarWidth) * duration;
        
        onReady.seekTo(seekToTime);
        setCurrentTime(seekToTime);
      }
    } catch (err) {
      console.error("Ignored seek: YouTube player already unmounted.", err);
    }
  };;

  /**
   * Prompts the user for microphone permissions to expose detailed Bluetooth/Headset device labels.
   * By default, browsers hide these labels for privacy until permissions are granted.
   * @param {React.MouseEvent} e - The click event.
   */
  const unlockDeviceLabels = async (e) => {
    e.stopPropagation();
    try {
      // Briefly request audio permission to unlock hardware labels
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Immediately stop the mic stream so the red recording dot disappears
      stream.getTracks().forEach((track) => track.stop());
      
      // Re-evaluate available devices with unlocked labels
      checkAudioDevices();
    } catch (err) {
      console.warn("Permission denied or no microphone available:", err);
      // Fallback: manually toggle the UI icon if permission fails
      setIsExternalDevice((prev) => !prev); 
    }
  };

  /**
   * Polls navigator for audio outputs and checks for external headsets.
   * Wrapped in useCallback to safely include in useEffect dependency arrays.
   */
  const checkAudioDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputs = devices.filter((device) => device.kind === "audiooutput");
      
      // Check labels for keywords indicating an external bluetooth/wired device
      const hasExternal = audioOutputs.some((device) => {
        const label = device.label.toLowerCase();
        setDeviceLabel(device?.label);
        return label.includes("bluetooth") || label.includes("headset") || label.includes("headphone");
      });
      
      setIsExternalDevice(hasExternal);
    } catch (err) {
      console.error("Error checking connected audio devices:", err);
    }
  }, []);

  // --- Effects ---

  // Update URL params when leaving/joining
  useEffect(() => {
    updateParamsId(isLeaving ? "" : id);
  }, [id, isLeaving, updateParamsId]);

  // Setup listeners for hardware audio device changes
  useEffect(() => {
    checkAudioDevices();

    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener("devicechange", checkAudioDevices);
      return () => {
        navigator.mediaDevices.removeEventListener("devicechange", checkAudioDevices);
      };
    }
  }, [checkAudioDevices]);

  useEffect(() => {
    // Only run this sync logic in Jam Mode when we have a song and a playedAt timestamp
    if (playerMode === PLAYER_MODE.JAM && currentPlaying?.playedAt) {
      
      // 1. Convert Firestore Timestamp to standard milliseconds
      const startTimeMs = currentPlaying.playedAt.toMillis 
        ? currentPlaying.playedAt.toMillis() 
        : currentPlaying.playedAt;
        
      const currentTimeMs = Date.now();
      
      // 2. Calculate elapsed seconds
      const elapsedSeconds = (currentTimeMs - startTimeMs) / 1000;
      
      // 3. Fallback duration (assume 3 minutes if duration isn't explicitly saved)
      const songDuration = duration; 
  
      // 4. Sync check
      if (elapsedSeconds > 0 && elapsedSeconds < songDuration) {
        // Seek to the exact second everyone else is on
        setCurrentTime(elapsedSeconds);
        
        // If you are using a ref for a player (like react-player or YouTube iframe):
        // playerRef.current.seekTo(elapsedSeconds, 'seconds');
      } else {
        // If elapsed time is greater than the song duration, start from 0
        setCurrentTime(0);
      }
    }
  }, [currentPlaying, playerMode, setCurrentTime, duration]);

  // --- Render Helpers ---
  const progressBarStyle = {
    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
    height: "100%",
  };

  return (
    <div className="bg-black">
      {/* Conditionally hide JoinRoom modal in Solo Mode */}
      {!isSolo && <JoinRoom codeViaProps={id} />}

      <PlayerHeader handlePause={handlePause} />
      
      {isLoading || !thumbnail ? (
        <PlayerShimmer />
      ) : (
        <>
          {/* Album Artwork */}
          <div className="m-3 mt-8 ms-4 me-4">
            <img
              src={thumbnail}
              className="h-56 mx-auto rounded-md object-cover shadow-lg"
              alt="Track thumbnail"
              loading="lazy"
            />
          </div>
          
          {/* Metadata Section */}
          <div className="m-3 mt-5">
            <div className="flex items-center justify-between ms-2 gap-6 overflow-hidden">
              {/* Marquee for long titles to prevent overflow */}
              {title?.length >= 19 ? (
                <Marquee style={{ width: "85%" }} gradient={false}>
                  <h5 className="text-slate-50 bg-black m-0 me-2">
                    <b>{title || "Unknown Song"}</b>
                  </h5>
                </Marquee>
              ) : (
                <h5 className="text-slate-50 bg-black m-0 truncate">
                  <b>{title || "Unknown Song"}</b>
                </h5>
              )}
              
              <LikeSong iconSize={38} color={"#f1f5f9"} />
            </div>
            
            {/* Artist Navigation */}
{/* Artist Navigation */}
<div className="flex items-center justify-start gap-1">
{playedBy === autoSuggest ? <IoSparkles color="#1ed760" /> : null}
{artist?.length >= 40 ? (
              <Marquee className="mx-2" style={{ width: "85%" }} gradient={false}>
                <Link 
                  to={currentPlaying?.artistId ? getPath(ROUTE.ARTIST, roomCode).replace(':artist', currentPlaying.artistId) : "#"} 
                  className="text-slate-200 m-2 mt-1 text-sm no-underline hover:text-white transition-colors"
                >
                  {artist || "Unknown Artist"}
                </Link>
              </Marquee>
            ) : (
              <Link 
                to={currentPlaying?.artistId ? getPath(ROUTE.ARTIST, roomCode).replace(':artist', currentPlaying.artistId) : "#"} 
                className="flex items-center gap-2 text-slate-200 m-2 mt-1 text-sm no-underline hover:text-white transition-colors  truncate"
              >
                 {artist || "Unknown Artist"}
              </Link>
            )}
</div>

            {/* Played By Indicator */}
          {playerMode === PLAYER_MODE.JAM &&  <p className="m-2 text-xs flex items-center gap-1 text-gray-400">
              <IoPerson aria-hidden="true" /> {playedBy || "Solo Player"}
            </p>}
          </div>

          {/* Interactive Seekbar */}
          {onReady ? (
            <>
              <div
                className="bg-zinc-800 border-zinc-800 border-2 rounded-full h-1.5 cursor-pointer mx-auto relative group"
                ref={seekBarRef}
                onClick={handleSeek}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                style={seekBarStyle}
                role="slider"
                aria-valuemin="0"
                aria-valuemax={duration}
                aria-valuenow={currentTime}
                aria-label="Seek track"
              >
                <div
                  className="seek-bar-progress bg-slate-100 rounded-full transition-all duration-75 group-hover:bg-white"
                  style={progressBarStyle}
                ></div>
              </div>
              <div className="mt-2 flex items-center justify-between text-slate-50 text-sm m-3 font-mono">
                <span>{secondsToMinutes(currentTime)}</span>
                <span>{secondsToMinutes(duration)}</span>
              </div>
            </>
          ) : (
            /* Loading State for Seekbar */
            <div className="bg-zinc-700 border-zinc-800 border-2 rounded-full h-1.5 mx-auto w-[90%] relative overflow-hidden">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-600 rounded-full"></div>
            </div>
          )}

          {/* Primary Player Controls */}
          <div className="flex justify-center items-center mt-2 gap-8 pb-5">
            <button
              className="bg-zinc-800 rounded-full p-3 text-center hover:bg-zinc-700 transition-colors focus:outline-none "
              onClick={handleBack}
              aria-label="Previous Track"
            >
              <IoPlaySkipBack size={26} color={"white"} />
            </button>
            
            <button
              className="bg-zinc-800 rounded-full p-3 text-center hover:bg-zinc-700 transition-colors focus:outline-none "
              onClick={isPause ? handlePlay : handlePause}
              aria-label={isPause ? "Play Track" : "Pause Track"}
            >
              {isPause ? <IoPlay size={26} color={"white"} /> : <IoPause size={26} color={"white"} />}
            </button>
            
            <button
              className="bg-zinc-800 rounded-full p-3 text-center hover:bg-zinc-700 transition-colors"
              onClick={handleForward}
              aria-label="Next Track"
            >
              <IoPlaySkipForward size={26} color={"white"} />
            </button>
          </div>
        </>
      )}

      {/* Auxiliary Controls (Bottom Toolbar) */}
      <div className="flex items-center justify-between ms-3 -mt-5 pb-14">
        
        {/* Audio Output Device Indicator */}
        <button 
          onClick={unlockDeviceLabels}
          className="cursor-pointer focus:outline-none p-2 rounded-lg hover:bg-zinc-900/50 transition-colors"
          aria-label="Identify Connected Audio Device"
        >
          {isExternalDevice ? (
           <div className="flex flex-row gap-1 items-center text-nowrap text-[10px] text-slate-50 font-medium">
             <IoHeadsetOutline size={22} className="text-emerald-400" />
             {deviceLabel || "External Device"} 
           </div>
          ) : (
            <LuSpeaker size={22} className="text-slate-200" />
          )}
        </button>

        <div className="flex items-end gap-6 float-right m-3">
          {/* Hide Jam-specific features (Roommates & Share) in Solo Mode */}
          {!isSolo && (
              <RoommatesDrawer />
          )}
              <button 
                className="focus:outline-none  rounded-full hover:bg-zinc-800 transition-colors"
                onClick={handleShare}
                aria-label="Share Room"
              >
                <HiOutlineShare size={20} className="text-slate-200 hover:text-slate-400" />
              </button>
          <QueueDrawer handlePlay={handlePlay} handlePause={handlePause} />
        </div>
      </div>
      
      {/* Dynamic Lyrics Engine */}
      <Lyrics />
    </div>
  );
};

export default Index;