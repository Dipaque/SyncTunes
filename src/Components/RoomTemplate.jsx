import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";

const RoomTemplate = ({ data }) => {
  const nav = useNavigate();
  const [showToast, setShowToast] = useState(true);
  const [toastMessage,setToastMessage] = useState("")

  const handleJoin = () => {
    const roomCode = sessionStorage.getItem("roomCode");
    if(roomCode){
        setShowToast(true);
        setToastMessage("Please exit room to join")
        setTimeout(()=>setShowToast(false),4000)
    }else{
        nav(`/room/${data?.roomCode}/player`)
    }
  }

  return (
    <>
     <div
      className="relative h-44 w-full mb-3 rounded-xl overflow-hidden bg-cover bg-center flex items-end p-2"
      style={{
        backgroundImage: `url(${data?.currentPlaying?.image})`,
      }}
      onClick={()=>handleJoin()}
    >
      {/* Black fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 text-white w-full">
        <p className="flex items-center gap-2 w-full">
          <span className="flex-1 text-xs font-semibold truncate">
            {data?.currentPlaying?.title}
          </span>

          <div className="sound-bars flex items-end gap-[2px] shrink-0">
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
          </div>
        </p>

        <div className="flex justify-between items-center text-[10px] text-zinc-300 mt-1">
          <span>#{data?.roomCode}</span>
          <span>{data?.members?.length || 0} 👥</span>
        </div>
      </div>
    </div>

    {/* {showToast && (
    <div className="flex justify-center z-50">
      <Toast showToast={showToast} message={toastMessage} />
    </div>
  )} */}
    </>
   
  );
};

export default RoomTemplate;
