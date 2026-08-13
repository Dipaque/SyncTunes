import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import logo from "../assests/logo.png";
import { useStateContext } from "../Context/ContextProvider";
import { db } from "../firebase-config";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import LeaveRoom from "./modal/LeaveRoom";
import LikedUsers from "./LikedUsers";
import { useNavigate } from "react-router-dom";
import KebabButton from "./kebab_btn/KebabButton";
import { IoCheckmark, IoCopyOutline } from "react-icons/io5";
import { getRoutes, PLAYER_MODE } from "../constants";

const PlayerHeader = ({ handlePause }) => {
  const [currentSong, setCurrentSong] = useState([]);
  const [isCopied, setIsCopied] = useState(false)
  const nav = useNavigate();
  const {
    setVideoIds,
    setIsLeaving,
    pathName,
    handleClear,
    songsList,
    currentPlaying,
    roomMate,
    setRoomMate,
    admin,
    setAdmin,
    playerMode
  } = useStateContext();

  const roomCode = sessionStorage.getItem("roomCode");

  useEffect(() => {
    const getData = () => {
      try{
        if (roomCode) {
          const filteredUsersQuery = query(
            collection(db, "room"),
            where("roomCode", "==", roomCode)
          );
          onSnapshot(filteredUsersQuery, (data) => {
            setCurrentSong(
              data.docs.map((doc) => ({ ...doc?.data(), id: doc?.id }))
            );
            setVideoIds(data?.docs[0]?.data()?.currentSong);
            setRoomMate(data?.docs[0]?.data()?.roomMates);
            setAdmin({
              userName: data?.docs[0]?.data()?.roomAdmin,
              email: data?.docs[0]?.data()?.adminEmail ?? "",
            });
          });
        }
      }catch(err){
        console.log(err)
      }
    };
    getData();
  }, [roomCode]);

  const requestPermission = () => {
    // Check if the browser supports the Notification API
    if ("Notification" in window) {
      // Check if permission has not been granted previously
      if (Notification.permission !== "granted") {
        // Ask for permission
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {
          }
        });
      }
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const handleLeaveRoom = async () => {
    const isSolo = playerMode === PLAYER_MODE.SOLO;
    const ROUTE = getRoutes(isSolo);
    
    // 1. Close modal immediately if solo mode (prevent stuck modals)
    if (isSolo) {
      setIsLeaving(false);
      return; 
    }
    
    await handlePause();
  
    // 2. Wrap in roomCode check to prevent Firebase crashes
    if (roomCode) {
      if (roomMate?.length > 0) {
        try {
          const index = roomMate.findIndex(
            (user) => user.email === Cookies.get("email")
          );
          
          // 3. Fix State Mutation: Create a fresh copy of the array
          let updatedRoomMates = [...roomMate];
          
          if (index >= 0) {
            updatedRoomMates.splice(index, 1);
          }
          
          await updateDoc(doc(db, "room", roomCode), {
            roomMates: updatedRoomMates, // Upload the copy
          });
        } catch (err) {
          console.error("Error leaving room:", err);
        }
      }
    }
  
    // 4. Cleanup
    setCurrentSong([]); // Assuming this is local state in PlayerHeader
    handleClear(); // This handles thumbnail, isPause, artists, etc. automatically
    sessionStorage.removeItem("roomCode");
    
    // 5. Explicitly set to false instead of toggling (!isLeaving)
    setIsLeaving(false);
    
    // 6. Safe navigation (Home doesn't need getPath injection)
    nav(ROUTE.HOME); 
  };

  const handleCopy=(roomCode)=>{
    try {
      // Safely attempt to write to the clipboard
      navigator.clipboard.writeText = roomCode;
      setIsCopied(true);

      // reset the copy
      setTimeout(()=>{
        setIsCopied(false);
      },3000)
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
  return (
    <>
      <div className="flex items-center justify-between mb-3 p-3">
        <div className="flex items-center gap-2 ">
          <img src={logo} height={15} width={15} alt="logo" />
          <span className="text-lg font-semibold text-gray-300">
            Sync-Tunes
          </span>
        </div>
        <KebabButton handleExit={() => setIsLeaving(true)} />
      </div>
      <div className="w-screen h-full bg-black p-3 pt-12" id="top">
        <LeaveRoom handleLeaveRoom={handleLeaveRoom} />

        {roomCode && currentSong.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="font-bold mb-2  text-zinc-500 flex gap-1 items-center">
                ROOM:
                <span className="text-lg text-white">{roomCode}</span>
               {isCopied ? <IoCheckmark className="ms-2 cursor-pointer" /> : <IoCopyOutline className="ms-2 cursor-pointer" onClick={()=>handleCopy(roomCode)} />}
              </span>
            </div>
            <div className="text-white flex flex-row items-center  justify-between">
              <span className="text-xs truncate">
                {`Host: ${admin.userName}`}
              </span>
              {songsList &&
                currentPlaying &&
                pathName.includes("/room/" + roomCode + "/player") && (
                  <span className="flex items-center gap-2 text-xs text-slate-200">
                    <LikedUsers />{" "}
                  </span>
                )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default PlayerHeader;
