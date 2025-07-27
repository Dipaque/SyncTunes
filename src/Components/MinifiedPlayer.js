import React from "react";
import { useStateContext } from "../Context/ContextProvider";
import Marquee from "react-fast-marquee";
import LikeSong from "./LikeSong";
import { IoPause, IoPlay } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const MinifiedPlayer = () => {
  const { thumbnail, title, onReady, isPause, setIsPause,  duration,
    currentTime,
    setCurrentTime,
    setIsSeeking,
    seekBarRef, 
} = useStateContext();

    const nav = useNavigate();

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
    const roomCode = sessionStorage.getItem("roomCode")||""
    nav(`/room/${roomCode}/player`);
  };

  return (
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-md animate-controller bg-zinc-900/50 backdrop-blur-md border-t border-white/10 w-[95vw] max-w-xl"  onClick={handleNavigate}>
      <div className="p-3 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
        <img
          src={thumbnail || ""}
          className=" h-8 w-12"
          alt="thumbnail"
        />
        <div className=" text-slate-100 line-clamp-1 text-sm">
          <Marquee>{title || "Song name"}</Marquee>
        </div>
        </div>

        <div className="flex items-center gap-2">
          <LikeSong color={"#f1f5f9"} iconSize={27} />
        {isPause ? (
              <div
                className="text-center "
                onClick={(e) =>{
                    e.stopPropagation()
                     handlePlay()
                    }}
              >
                <IoPlay size={26} color={"white"} />
              </div>
            ) : (
              <div
                className="rounded-full text-center "
                onClick={(e) =>{ 
                    e.stopPropagation()
                    handlePause()
                }}
              >
                <IoPause size={26} color={"white"} />
              </div>
            )}
        </div>
      </div>
      <div
            className=" bg-[#4d4d4d]  border-zinc-800 border-2 rounded-full  h-[2px] cursor-pointer mx-auto"
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
              className="seek-bar-progress bg-slate-100 rounded-full "
              style={progressBarStyle}
            ></div>
          </div>
    </div>
  );
};

export default MinifiedPlayer;
