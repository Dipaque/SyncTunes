import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Cookies from "js-cookie";
import YouTubeVideo from "../Components/YoutubeVideo";
import { VscSignOut } from "react-icons/vsc";
import { useStateContext } from "../Context/ContextProvider";
import { db } from "../firebase-config";
import CreateRoom from "../Components/CreateRoom";
import JoinRoom from "../Components/JoinRoom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import LeaveRoom from "../Components/LeaveRoom";
import { IoBookmarksOutline } from "react-icons/io5";
import LikedUsers from "../Components/LikedUsers";
const Homepage = () => {
  const [currentSong, setCurrentSong] = useState([]);
  const {
    setVideoIds,
    setIsLeaving,
    isLeaving,
    playedBy,
    pathName,
    handleClear,
    songsList,
    currentPlaying,
  } = useStateContext();
  const [roomMate, setRoomMate] = useState([]);
  const [admin, setAdmin] = useState({
    email:"",
    userName:"",
  });
  const now = new Date();

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
          setRoomMate(data?.docs[0]?.data()?.members);
          setAdmin({userName:data?.docs[0]?.data()?.roomAdmin,email:data?.docs[0]?.data()?.adminEmail??""});
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
    if (roomMate.length > 0) {
      const index = roomMate.indexOf(Cookies.get("name"));
      if (index > -1) {
        roomMate.splice(index, 1);
      }
      await updateDoc(doc(db, "room", sessionStorage.getItem("roomCode")), {
        members: roomMate,
      });
    }
    setCurrentSong([]);
    handleClear();
    sessionStorage.removeItem("roomCode");
    setIsLeaving(!isLeaving);
  };
  return (
    <>
      <Sidebar />
      <div className="flex justify-center gap-0  w-screen h-full bg-black " id="top">
        <CreateRoom />
        <JoinRoom />
        <LeaveRoom handleLeaveRoom={handleLeaveRoom} />
        <div className=" m-3 mb-5  rounded-lg w-96 ">
          {Cookies.get("name") &&
            !sessionStorage.getItem("roomCode") &&
            pathName.includes("home") && (
              <div className="text-white  mt-3 text-lg ml-3 flex justify-start  items-center   ">
                <b className=" ">
                  {"Welcome " + Cookies.get("name").split(" ")[0] ||
                    Cookies.get("name")}
                </b>
              </div>
            )}
          {sessionStorage.getItem("roomCode") && currentSong.length > 0 && (
            <div className=" flex items-center  justify-center flex-col  ">
             <div
  className={`transition-all duration-300 ease-in-out transform mt-2 ${
    (admin.userName && now.getSeconds() % 4 === 0) || playedBy
      ? "opacity-100 translate-y-0"
      : "opacity-0 -translate-y-2"
  }`}
>
  <p className="text-xs text-slate-50 transition-opacity duration-300">
    {
       `Created by ${
          admin.email === Cookies.get("email") || admin.userName === Cookies.get("name")
            ? "you"
            : admin.userName.split(" ")[0] || admin.userName
        }`}
  </p>
</div>

              <button
                className=" mx-auto  text-xs mb-2  text-white flex flex-row justify-center items-center gap-2"
                type="button"
                onClick={() => setIsLeaving(true)}
              >
                <VscSignOut color="white" size={18} />
                {sessionStorage.getItem("roomCode")}
              </button>
              <p className="text-xs text-slate-50 transition-opacity duration-300">
              {playedBy
      && `Played by ${playedBy.split(" ")[0] || playedBy}
              `}
              </p>

              {songsList && currentPlaying && pathName.includes("home") && (
                <p className="flex items-center gap-2 text-xs text-slate-200">
                  <LikedUsers />{" "}
                </p>
              )}
              {<YouTubeVideo videoIds={currentSong[0].currentSong} />}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Homepage;
