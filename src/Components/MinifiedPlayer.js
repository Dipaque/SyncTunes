import React, { useState, useEffect } from "react";
import { useStateContext } from "../Context/ContextProvider";
import Marquee from "react-fast-marquee";
import LikeSong from "./LikeSong";
import { IoPause, IoPlay, IoHeadset } from "react-icons/io5";
import { LuSpeaker } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { getRoutes, PLAYER_MODE } from "../constants";
import { getPath } from "../utils/getPath";
import LikeEntity from "./likes/LikeEntity";

const MinifiedPlayer = () => {
  const { 
    currentPlaying, onReady, isPause, setIsPause, duration,
    currentTime, setCurrentTime, setIsSeeking, seekBarRef, playerMode
  } = useStateContext();

  const nav = useNavigate();

  // Extract data from current playing
  const { image: thumbnail, title, id: songId } = currentPlaying

  const isSolo = playerMode === PLAYER_MODE.SOLO;
  const ROUTE = getRoutes(isSolo);
  
  // State to track if the active device is a headset/bluetooth
  const [isExternalDevice, setIsExternalDevice] = useState(false);

  // Check for connected audio output devices
  useEffect(() => {
    const checkAudioDevices = async () => {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
        
        // Check labels for keywords indicating an external device
        // Note: Labels may be empty on some browsers until microphone permissions are granted
        const hasExternal = audioOutputs.some(device => {
          const label = device.label.toLowerCase();
          return label.includes('bluetooth') || label.includes('headset') || label.includes('headphone');
        });
        
        setIsExternalDevice(hasExternal);
      } catch (err) {
        console.error("Error checking devices:", err);
      }
    };

    checkAudioDevices();

    // Listen for devices connecting/disconnecting in real-time
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', checkAudioDevices);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', checkAudioDevices);
      };
    }
  }, []);

  const handlePause = () => {
    if (onReady) {
      onReady?.pauseVideo();
      setIsPause(true);
    }
  };

  const handlePlay = () => {
    if (onReady) {
      onReady.playVideo();
      setIsPause(false);
    }
  };

  const handleMouseDown = () => {
    setIsSeeking(true);
  };

  const handleMouseUp = () => {
    setIsSeeking(false);
  };

  const handleSeek = (event) => {
    event.stopPropagation();
    const seekBar = seekBarRef?.current ?? event.currentTarget;
  
    if (seekBar && onReady) {
      const seekBarWidth = seekBar.offsetWidth;
      const offsetX = event.nativeEvent.offsetX;
      const seekToTime = (offsetX / seekBarWidth) * duration;
  
      onReady.seekTo(seekToTime);
      setCurrentTime(seekToTime);
    }
  };
  
  const progressBarStyle = {
    width: `${(currentTime / duration) * 100}%`,
    height: "100%",
  };

  const handleNavigate = () => {
    const roomCode = sessionStorage.getItem("roomCode") || "";
    nav(getPath(ROUTE.PLAYER, roomCode));
  };

  return (
    <div 
    className="fixed bottom-16 left-1/2 -translate-x-1/2 rounded-md animate-controller bg-zinc-900/50 backdrop-blur-md  w-[95vw] max-w-xl z-50 shadow-xl"      onClick={handleNavigate}
    >
      <div className="p-3 pt-2 flex justify-between items-center gap-2 px-2">
        
        {/* Left Side: Thumbnail & Title */}
        <div className="flex items-center gap-2 w-1/2">
          <img
            src={thumbnail || ""}
            className="h-10 w-14 rounded-md object-cover"
            alt="thumbnail"
          />
          <div className="text-slate-100 text-sm overflow-hidden whitespace-nowrap">
           {title?.length > 12 ? <Marquee speed={30} delay={2}>
              <span className="pr-10">{title || "Song name"}</span>
            </Marquee> : <span className="pr-10">{title || "Song name"}</span>
            }
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="flex items-center gap-3">
          
          {/* Audio Output Device Indicator */}
          <div 
            onClick={(e) => e.stopPropagation()} // Prevents maximizing player if user taps icon
            className="flex items-center justify-center cursor-pointer"
          >
            {isExternalDevice ? (
              <IoHeadset size={22} className="text-[#1ed760]" /> // Spotify Green for active external device
            ) : (
              <LuSpeaker size={22} className="text-slate-300" />
            )}
          </div>

          <LikeEntity type={"song"} color={"#f1f5f9"} iconSize={27} id={songId} />
          
          {isPause ? (
            <div
              className="text-center cursor-pointer"
              onClick={(e) =>{
                e.stopPropagation();
                handlePlay();
              }}
            >
              <IoPlay size={26} color={"white"} />
            </div>
          ) : (
            <div
              className="rounded-full text-center cursor-pointer"
              onClick={(e) =>{ 
                e.stopPropagation();
                handlePause();
              }}
            >
              <IoPause size={26} color={"white"} />
            </div>
          )}
        </div>
      </div>

      {/* Seek Bar */}
      <div
        className="bg-[#4d4d4d] border-zinc-800 border-2 rounded-full h-[2px] cursor-pointer mx-auto"
        ref={seekBarRef}
        onClick={handleSeek}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          width:"100%",
          height:"8px",
          position:"absolute",
          bottom:"1px",
        }}
      >
        <div
          className="seek-bar-progress bg-slate-100 rounded-full"
          style={progressBarStyle}
        ></div>
      </div>
    </div>
  );
};

export default MinifiedPlayer;