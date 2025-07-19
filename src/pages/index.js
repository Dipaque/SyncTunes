import React from "react";
import { useStateContext } from "../Context/ContextProvider";
import {
  IoPause,
  IoPlay,
  IoPlaySkipBack,
  IoPlaySkipForward,
} from "react-icons/io5";
import { HiOutlineShare } from "react-icons/hi";
import Marquee from "react-fast-marquee";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { secondsToMinutes, seekBarStyle } from "../Functions/secondsToMinutes";
import PlayerShimmer from "../Components/PlayerShimmer";
import LikeSong from "../Components/LikeSong";
import QueueDrawer from "../Components/QueueDrawer";
import Cookies from "js-cookie";
const Index = () => {
  const {
    videoIds,
    setmodal_backdrop,
    onReady,
    setmodal_backdrop1,
    title,
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
  } = useStateContext();

  const name = Cookies.get("name");

  const handleForward = async () => {
    const index = videoIds.findIndex((data) => data.id === currentPlaying.id);
    if (index !== videoIds.length - 1) {
      await updateDoc(doc(db, "room", sessionStorage.getItem("roomCode")), {
        currentPlaying: videoIds[index + 1],
      }).catch((err) => console.log(err));
    }
    setCurrentTime(0);
  };
  const handleBack = async () => {
    const index = videoIds.findIndex((data) => data.id === currentPlaying.id);
    if (index > 0) {
      await updateDoc(doc(db, "room", sessionStorage.getItem("roomCode")), {
        currentPlaying: videoIds[index - 1],
      }).catch((err) => console.log(err));
    }
    setCurrentTime(0);
  };
  const handlePause = () => {
    if (onReady && currentPlaying) {
      onReady?.pauseVideo();
      setIsPause(true);
    }
  };
  const handlePlay = () => {
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
  const handleSeek = (event) => {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out Sync-Tunes 🎶",
          text: "A fun way to jam music with your friends!",
          url: "https://sync-tunes.vercel.app", // or your app URL e.g., 'https://sync-tunes.vercel.app'
        })
        .then(() => console.log("Thanks for sharing!"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  return (
    <div className="bg-black">
      {!sessionStorage.getItem("roomCode") ? (
        <>
          <div className=" flex justify-center gap-2 mb-5  mx-auto">
            <button
              className="border pl-2 pr-2 bg-slate-50   p-2 rounded-lg text-black"
              type="button"
              onClick={() => {
                setmodal_backdrop(true);
              }}
            >
              New Room
            </button>
            <button
              className="border-zinc-500 border-1 pl-2 pr-2    p-2 rounded-lg text-white"
              onClick={() => {
                setmodal_backdrop1(true);
              }}
            >
              Join with a code
            </button>
          </div>
          <div className="flex flex-col justify-center items-center mt-14 m-3 text-slate-50">
            <img
              src={require("../assests/recorder.png")}
              height={200}
              width={200}
              alt="recorder"
            />
            <h5>
              <b>Get the link that you can share</b>
            </h5>
            <p className="text-sm text-center">
              Tap on new room to generate your own room code and share it with
              your friends!
            </p>
          </div>
        </>
      ) : isLoading ? (
        <PlayerShimmer />
      ) : (
        <>
          <div className="m-3 mt-1">
            <div className="flex items-center justify-start ms-2 gap-6">
              <Marquee style={{ width: "85%" }}>
                <h5 className="text-slate-50 bg-black">
                  <b>{title || "Song name"}</b>
                </h5>
              </Marquee>
              <LikeSong iconSize={38} color={"#f1f5f9"} />
            </div>

            <p className="text-slate-200 m-2">{artist || "Artist name"}</p>
          </div>
          {/* Seekbar */}
          {onReady && currentPlaying && currentTime ? (
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
          <div className="flex justify-center items-center mt-8 gap-8 pb-12 ">
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
          {/* View Queued Songs */}
          <div className=" flex items-end gap-6 float-right -mt-2 m-3">
            <HiOutlineShare
              size={20}
              cursor={"pointer"}
              className="text-slate-200 hover:text-slate-400"
              onClick={handleShare}
            />
            <QueueDrawer handlePlay={handlePlay} handlePause={handlePause} />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
