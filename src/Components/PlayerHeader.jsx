import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { VscSignOut } from "react-icons/vsc";
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
import LeaveRoom from "./LeaveRoom";
import LikedUsers from "./LikedUsers";
import { useNavigate } from "react-router-dom";
const PlayerHeader = ({handlePause}) => {
  const [currentSong, setCurrentSong] = useState([]);
  const nav = useNavigate()
  const {
    setVideoIds,
    setIsLeaving,
    setIsPause,
    isLeaving,
    pathName,
    handleClear,
    songsList,
    currentPlaying,
    roomMate,
    setRoomMate,
    admin, 
    setAdmin,
    setThumbnail
  } = useStateContext();

  const roomCode = sessionStorage.getItem("roomCode")

  useEffect(() => {
    const getData = () => {
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
    await handlePause();

    if (roomMate?.length > 0) {
      try{
        const index = roomMate.findIndex((user)=>user.email===Cookies.get("email"));
        if (index >= 0) {
          roomMate.splice(index, 1);
        }
        await updateDoc(doc(db, "room", roomCode), {
          roomMates: roomMate,
        });

      }catch(err){
        console.log(err)
      }
    }
    setCurrentSong([]);
    setIsPause(true)
    setThumbnail("")
    handleClear();
    nav("/home")
    sessionStorage.removeItem("roomCode");
    setIsLeaving(!isLeaving);

  };
  return (
    <>
      <div
        className="w-screen h-full bg-black p-3 pt-12"
        id="top"
      >
        <LeaveRoom handleLeaveRoom={handleLeaveRoom} />
        
          {roomCode && currentSong.length > 0 && (

            
            <>
            <div className="flex items-center justify-between">
                <span
                className="font-bold mb-2  text-zinc-500 flex gap-1 items-center"
                
              >
               ROOM:
               <span className="text-lg text-white">{roomCode}</span>
              </span>
              <VscSignOut type="button" size={18} color="white" onClick={() => setIsLeaving(true)} />
            </div>
              <div className="text-white flex flex-row items-center  justify-between">
                          <span className="text-xs truncate">


                  {`Host: ${admin.userName}`}
                </span>
              {songsList && currentPlaying && pathName.includes("/room/"+roomCode+"/player") && (
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
