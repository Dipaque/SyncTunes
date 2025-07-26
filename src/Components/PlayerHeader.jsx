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
const PlayerHeader = () => {
  const [currentSong, setCurrentSong] = useState([]);
  const nav = useNavigate()
  const {
    setVideoIds,
    setIsLeaving,
    setIsPause,
    isLeaving,
    playedBy,
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
      if (sessionStorage.getItem("roomCode")) {
        const filteredUsersQuery = query(
          collection(db, "room"),
          where("roomCode", "==", sessionStorage.getItem("roomCode"))
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
  }, [sessionStorage.getItem("roomCode")]);

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
    if (roomMate?.length > 0) {
      const index = roomMate.findIndex((user)=>user.email===Cookies.get("email"));
      if (index > -1) {
        roomMate.splice(index, 1);
      }
      await updateDoc(doc(db, "room", sessionStorage.getItem("roomCode")), {
        roomMates: roomMate,
      });
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
        className="flex justify-center gap-0  w-screen h-full bg-black "
        id="top"
      >
        <LeaveRoom handleLeaveRoom={handleLeaveRoom} />
        <div className=" m-3 mb-3">
        
          {sessionStorage.getItem("roomCode") && currentSong.length > 0 && (
            <div className=" flex items-center  justify-center flex-col  ">
              <p className="text-xs mx-auto text-slate-200">
                  {`Created by ${
                    admin.email === Cookies.get("email") ||
                    admin.userName === Cookies.get("name")
                      ? "you"
                      : admin.userName.split(" ")[0] || admin.userName
                  }`}
                </p>
              <button
                className=" mx-auto  text-xs mb-2  text-white flex flex-row justify-center items-center gap-2"
                type="button"
                onClick={() => setIsLeaving(true)}
              >
                <VscSignOut color="white" size={18} />
                {sessionStorage.getItem("roomCode")}
              </button>
              <p className="text-xs text-slate-50 transition-opacity duration-300">
                {playedBy &&
                  `Played by ${playedBy.split(" ")[0] || playedBy}
              `}
              </p>

              {songsList && currentPlaying && pathName.includes("/room/"+roomCode+"/player") && (
                <p className="flex items-center gap-2 text-xs text-slate-200">
                  <LikedUsers />{" "}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default PlayerHeader;
