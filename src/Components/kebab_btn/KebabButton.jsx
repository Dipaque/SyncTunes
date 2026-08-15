import React, { useState } from "react";
import { useStateContext } from "../../Context/ContextProvider";
import Cookies from "js-cookie";

// import context provider
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";

// import icon
import { HiOutlineShare, HiOutlineTrash, HiOutlineUser,  } from "react-icons/hi";
import { HiOutlineQueueList } from "react-icons/hi2";
import { IoEllipsisVertical, IoRepeatOutline, IoShuffleOutline } from "react-icons/io5";
import { VscSignOut, VscPinned } from "react-icons/vsc"; 
import { BsPinFill } from "react-icons/bs";

// import constants;
import { fontFamily, localStorage_pinSongs, PLAYER_MODE } from "../../constants";

// import components
import ChangeRoomVisibility from "./ChangeRoomVisibility";
import DeleteRoom from "../modal/DeleteRoom";

// import utility
import { handleShare } from "../../Functions/handleShare";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import addToQueue from "../../Functions/addToQueue";
import shuffle from "../../Functions/shuffle";
import handlePin from "../../Functions/handlePin";
import playNext from "../../Functions/playNext";


const KebabButton = ({ handleExit }) => {
  const { id } = useParams();
  const {
    thumbnail,
    playedBy,
    title,
    admin,
    setIsPause,
    handleClear,
    playerMode,
    currentPlaying,
    videoIds,
    setVideoIds,
    setCurrentPlaying
  } = useStateContext();
  
  const email = Cookies.get("email");
  const roomCode = id || sessionStorage.getItem("roomCode");
  const isSolo = playerMode === PLAYER_MODE.SOLO;

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const nav = useNavigate();

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  // 1. Pure O(1) Lookup to check if currently playing song is pinned
  const pinnedSongsLookup = JSON.parse(localStorage.getItem(localStorage_pinSongs)) || {};
  const isPinned = currentPlaying ? !!pinnedSongsLookup[currentPlaying.id] : false;

  // Solo Options Configuration
  const soloOptions = [
    {
      // 3. Dynamic Text driven by the lookup state
      icon: isPinned ? <BsPinFill size={25} /> : <VscPinned size={25} strokeWidth="0.1" />,
      text: isPinned ? "Unpin Song" : "Pin Song",
      onClick:() => handlePin({song:currentPlaying, finalFunc: setIsOpen(false)}),
      show: true 
    },
    {
      icon: <HiOutlineQueueList size={25} />,
      text: "Add to Queue",
      onClick: () => {
        const trackImg = currentPlaying?.image || thumbnail; 
        addToQueue(trackImg, currentPlaying.title, currentPlaying.id, currentPlaying.channelName, videoIds, "Solo Playing", currentPlaying?.artistId, playerMode, setVideoIds, setCurrentPlaying);
        setIsOpen(false); 
      },
      show: true
    },
    {
      label: "Shuffle",
      icon: <IoShuffleOutline color='text-gray-400' size={23} />,
      text: "Added to Shuffle",
      onClick: () => {
        shuffle({
          newSongs: {
            image: currentPlaying?.image,
            title,
            id: currentPlaying?.id,
            channelName: currentPlaying?.channelName,
            artistId: currentPlaying?.artistId,
            playedBy: Cookies.get('name') || "Solo Player"
          },
          queuedSongs: videoIds,
          playerMode,
          setVideoIds
        });
        setIsOpen(false);
      },
      show: true
    },
    {
      icon: <IoRepeatOutline size={25} strokeWidth='0.2' />,
      text: "Repeat Song",
      onClick: () => {
        const trackImg = currentPlaying?.image || thumbnail; 
        playNext(trackImg, currentPlaying.title, currentPlaying.id, currentPlaying.channelName, videoIds, videoIds, currentPlaying, Cookies.get('name'), currentPlaying?.artistId, playerMode, setVideoIds)
        setIsOpen(false);
      },
      show: true
    },
    // {
    //   icon: <HiOutlineCollection strokeWidth="1.5" size={25} />,
    //   text: "Add to Playlist",
    //   onClick: () => {
    //     console.log("Add to Playlist");
    //     setIsOpen(false);
    //   }
    // },
    {
      icon: <HiOutlineUser strokeWidth="1.5" size={25} />,
      text: "Go to artist",
      onClick: () => {
        setIsOpen(false);
        if (currentPlaying?.artistId) {
          nav(`/artists/${currentPlaying?.artistId}`); 
        }
      },
      show: currentPlaying?.artistId ? true : false
    },
  ];

  const handleDeleteRoom = async () => {
    try {
      const docRef = doc(db, "room", roomCode);
      setIsPause(true);
      await deleteDoc(docRef).then(() => {
        handleClear();
        sessionStorage.removeItem("roomCode");
        nav("/home");
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <IoEllipsisVertical
        size={20}
        cursor={"pointer"}
        className="text-gray-300 hover:text-slate-400"
        onClick={handleOpen}
      />
      <Offcanvas
        className={`!bg-zinc-900 !text-slate-200 !h-[50%] !max-w-screen-sm ${
          isOpen ? "!animate-drawer" : "translate-y-0 !animate-slide-down"
        }`}
        direction="bottom"
        toggle={handleOpen}
        isOpen={isOpen}
        unmountOnClose={true}
        style={{
          fontFamily: fontFamily,
          borderTopLeftRadius: "14px",
          borderTopRightRadius: "14px",
        }}
      >
        <div
          className="border-1 border-gray-500 p-[1px] bg-gray-500 w-8 rounded-full mx-auto mt-3 cursor-pointer"
          onClick={handleOpen}
        />

        <OffcanvasHeader className="border-b border-b-gray-700 pb-0">
          <div className="flex items-center justify-start !text-sm text-gray-200  gap-2 mb-2">
            <img
              src={currentPlaying?.image || thumbnail || ""}
              alt="thumbnail"
              className="h-12 w-16 rounded-md object-cover"
            />
            <span className="flex items-start gap-2">
              <div className="flex-1 text-base">
                <div className="line-clamp-1">{currentPlaying?.title || "Song name"}</div>
                <p className="mt-1 text-sm text-gray-500">
                  <span className="line-clamp-1">{!isSolo ? currentPlaying?.playedBy : currentPlaying?.channelName || "artist"}</span>
                </p>
              </div>
            </span>
          </div>
        </OffcanvasHeader>
        <OffcanvasBody>
          
          <div
            className="flex items-center gap-3 text-gray-300 cursor-pointer hover:text-white transition-colors p-2 -mx-2 rounded-lg hover:bg-zinc-800"
            onClick={() => {
              handleShare();
              setIsOpen(false);
            }}
          >
            <HiOutlineShare type="button" size={23} className="text-gray-400" />
            Share
          </div>

          {/* Render Solo Options dynamically */}
          {isSolo && soloOptions.map((option) => (
            <div 
              key={option.text} 
              onClick={option.onClick} 
              className={`flex items-center gap-3 text-gray-300 cursor-pointer hover:text-white transition-colors p-2 -mx-2 rounded-lg hover:bg-zinc-800 mt-2 ${option.show ? "block": "hidden"}`}
            >
              <span className="text-gray-400">{option.icon}</span>
              {option.text}
            </div>
          ))}
          
          {email === admin?.email && !isSolo && <ChangeRoomVisibility />}
          
          {!isSolo && (
            <div
              className="flex items-center gap-3 text-gray-300 mt-2 cursor-pointer hover:text-white transition-colors p-2 -mx-2 rounded-lg hover:bg-zinc-800"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => handleExit(), 300); 
              }}
            >
              <VscSignOut type="button" size={23} className="text-gray-400" />
              Exit Room
            </div>
          )}
          
          {email === admin?.email && !isSolo && (
            <div
              className="flex items-center gap-3 text-red-500 mt-2 cursor-pointer hover:text-red-400 transition-colors p-2 -mx-2 rounded-lg hover:bg-zinc-800"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => setIsOpenDeleteModal(true), 300); 
              }}
            >
              <HiOutlineTrash
                type="button"
                size={23}
                className="text-red-500"
              />
              Delete Room
            </div>
          )}
        </OffcanvasBody>
      </Offcanvas>
      
      {isOpenDeleteModal && (
        <DeleteRoom 
          isOpenDeleteModal={isOpenDeleteModal} 
          toggle={() => setIsOpenDeleteModal(!isOpenDeleteModal)} 
          handleDeleteRoom={handleDeleteRoom} 
        />
      )}

    </React.Fragment>
  );
};

export default KebabButton;