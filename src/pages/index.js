import React, { useEffect, useState } from "react";
import { useStateContext } from "../Context/ContextProvider";
import {
  IoHeadsetOutline,
  IoPause,
  IoPerson,
  IoPlay,
  IoPlaySkipBack,
  IoPlaySkipForward,
} from "react-icons/io5";

import Cookies from "js-cookie";
import { HiOutlineShare } from "react-icons/hi";
import Marquee from "react-fast-marquee";
import { doc, updateDoc, Timestamp, collection,
  query,
  orderBy,
  onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import { secondsToMinutes, seekBarStyle } from "../Functions/secondsToMinutes";
import PlayerShimmer from "../Components/PlayerShimmer";
import LikeSong from "../Components/LikeSong";
import QueueDrawer from "../Components/QueueDrawer";
import RoommatesDrawer from "../Components/RoommatesDrawer";
import PlayerHeader from "../Components/PlayerHeader";
import { Link, useParams } from "react-router-dom";
import JoinRoom from "../Components/modal/JoinRoom";
import { handleShare } from "../Functions/handleShare";
import { LuSpeaker } from "react-icons/lu";
const Index = ({ updateParamsId }) => {
  const {
    videoIds,
    onReady,
    title,
    playedBy,
    artist,
    currentPlaying,
    duration,
    currentTime,
    setCurrentTime,
    setIsSeeking,
    seekBarRef,
    isLoading,
    isPause,
    setIsPause,
    thumbnail,
    isLeaving
  } = useStateContext();

  const { id } = useParams();

  const roomCode = sessionStorage.getItem("roomCode") || id;

    // State to track if the active device is a headset/bluetooth
    const [isExternalDevice, setIsExternalDevice] = useState(false);
    const [deviceLabel, setDeviceLabel] = useState("");

  const handleForward = async () => {
    const index = videoIds.findIndex((data) => data.id === currentPlaying.id);
    if (index !== videoIds?.length - 1) {
      await updateDoc(doc(db, "room", roomCode), {
        currentPlaying: { ...videoIds[index + 1], playedAt: Timestamp.now() },
      }).catch((err) => console.log(err));
    }
    setCurrentTime(0);
  };
  const handleBack = async () => {
    const index = videoIds.findIndex((data) => data.id === currentPlaying.id);
    if (index > 0) {
      await updateDoc(doc(db, "room", roomCode), {
        currentPlaying: { ...videoIds[index - 1], playedAt: Timestamp.now() },
      }).catch((err) => console.log(err));
    }
    setCurrentTime(0);
  };
  const handlePause = async () => {
    if (onReady && currentPlaying && currentTime) {
      onReady?.pauseVideo();
      setIsPause(true);
    }
  };
  const handlePlay = async () => {
    if (onReady && currentPlaying) {
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
  const handleSeek = async (event) => {
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

  useEffect(() => {
    isLeaving ? updateParamsId("") : updateParamsId(id);
  }, [id, isLeaving, updateParamsId]);


  // Add this function inside MinifiedPlayer
  const unlockDeviceLabels = async (e) => {
    e.stopPropagation(); // Prevent maximizing the player
    
    try {
      // 1. Briefly request audio permission to unlock hardware labels
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 2. Immediately stop the mic stream so the red recording dot disappears
      stream.getTracks().forEach(track => track.stop());
      
      // 3. Now that we have permission, check the devices again
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
      
      const hasExternal = audioOutputs.some(device => {
        const label = device.label.toLowerCase();
        setDeviceLabel(device?.label)
        return label.includes('bluetooth') || label.includes('headset') || label.includes('headphone');
      });
      
      setIsExternalDevice(hasExternal);
    } catch (err) {
      console.error("Permission denied or no microphone available:", err);
      // Fallback: If they deny permission, manually toggle the UI as a fallback
      setIsExternalDevice(prev => !prev); 
    }
  };
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
          setDeviceLabel(device?.label)
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

  return (
    <div className="bg-black ">
      <JoinRoom codeViaProps={id} />

      <PlayerHeader handlePause={handlePause} />
      {isLoading || !thumbnail ? (
        <PlayerShimmer />
      ) : (
        <>
          <div className="m-3 mt-8 ms-4 me-4">
            <img
              src={thumbnail}
              className="h-56 mx-auto rounded-md"
              alt="thumbnail"
            />
          </div>
          <div className="m-3 mt-5">
            <div className="flex items-center justify-between ms-2 gap-6">
              {
                title.length >=34 ? <Marquee style={{ width: "85%" }}>
                <h5 className="text-slate-50 bg-black">
                  <b>{title || "Song name"}</b>
                </h5>
              </Marquee>
              :
              <h5 className="text-slate-50 bg-black">
                  <b>{title || "Song name"}</b>
                </h5>
              }
              
              <LikeSong iconSize={38} color={"#f1f5f9"} />
            </div>
            {artist.length >=40 ? <Marquee className="mx-2" style={{ width: "85%"}}><Link to={currentPlaying?.artistId ? `/room/${encodeURI(roomCode)}/artists/${currentPlaying?.artistId}` : ""} className="text-slate-200 m-2 mt-1 text-sm no-underline">{artist || "Artist name"}</Link></Marquee>: <Link to={currentPlaying?.artistId ? `/room/${encodeURI(roomCode)}/artists/${currentPlaying?.artistId}` : ""} className="text-slate-200 m-2 mt-1 text-sm no-underline">{artist || "Artist name"}</Link>}

            <p className="m-2 text-xs flex items-center gap-1 text-gray-400">
              <IoPerson /> {playedBy || "Player name"}
            </p>
          </div>
          {/* Seekbar */}
          {onReady ? (
            <>
              <div
                className=" bg-zinc-800 border-zinc-800 border-2 rounded-full  h-1.5 cursor-pointer mx-auto"
                ref={seekBarRef}
                onClick={handleSeek}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                style={seekBarStyle}
              >
                <div
                  className="seek-bar-progress bg-slate-100 rounded-full "
                  style={progressBarStyle}
                ></div>
              </div>
              <div className="mt-2 flex items-center justify-between  text-slate-50 text-sm m-3">
                <span>{secondsToMinutes(currentTime)}</span>
                <span>{secondsToMinutes(duration)}</span>
              </div>
            </>
          ) : (
            <div className="bg-zinc-700 border-zinc-800 border-2 rounded-full h-1.5 mx-auto w-[90%] relative overflow-hidden">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-600 rounded-full"></div>
            </div>
          )}

          {/* Player control */}
          <div className="flex justify-center items-center mt-2 gap-8 pb-5 ">
            <div
              className="bg-zinc-800 rounded-full p-3 text-center"
              onClick={() => handleBack()}
            >
              <IoPlaySkipBack size={26} color={"white"} />
            </div>
            {isPause ? (
              <div
                className="bg-zinc-800 rounded-full p-3 text-center"
                onClick={() => handlePlay()}
              >
                <IoPlay size={26} color={"white"} />
              </div>
            ) : (
              <div
                className="bg-zinc-800 rounded-full p-3 text-center"
                onClick={() => handlePause()}
              >
                <IoPause size={26} color={"white"} />
              </div>
            )}
            <div
              className="bg-zinc-800 rounded-full p-3 text-center"
              onClick={() => handleForward()}
            >
              <IoPlaySkipForward size={26} color={"white"} />
            </div>
          </div>
        </>
      )}

      {/* View Queued Songs */}
      <div className="flex items-center justify-between ms-3 -mt-5  pb-14 ">
        
                   {/* Audio Output Device Indicator */}
 <div 
            onClick={unlockDeviceLabels} // Prevents maximizing player if user taps icon
            className="cursor-pointer"
          >
            {isExternalDevice ? (
             <div className="flex flex-row gap-1 items-center text-nowrap text-[10px] text-slate-50 "><IoHeadsetOutline size={22} className="text-slate-300" />{deviceLabel} </div> // Spotify Green for active external device
            ) : (
              <LuSpeaker size={22} className="text-slate-300" />
            )}
          </div>
        <div className=" flex items-end gap-6 float-right  m-3">
        <RoommatesDrawer />
          <HiOutlineShare
            size={20}
            cursor={"pointer"}
            className="text-slate-200 hover:text-slate-400"
            onClick={handleShare}
          />
          <QueueDrawer handlePlay={handlePlay} handlePause={handlePause} />
        </div>
      </div>
    </div>
  );
};

export default Index;
