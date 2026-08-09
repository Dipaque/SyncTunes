import React, { useState } from "react";
import { useStateContext } from "../../Context/ContextProvider";
import Cookies from "js-cookie";

// import context provider
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";

// import icon
import { HiOutlineShare, HiOutlineTrash, HiOutlineUser, HiOutlineCollection } from "react-icons/hi";
import { HiOutlineQueueList } from "react-icons/hi2";
import { IoEllipsisVertical, IoPerson, IoShuffleOutline } from "react-icons/io5";
import { VscSignOut, VscPinned } from "react-icons/vsc"; // Added VscPinned for the Pin feature
import { CgTranscript } from "react-icons/cg";
import { IoIosHeartEmpty } from "react-icons/io";

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
import playNext from "../../Functions/playNext";
import shuffle from "../../Functions/shuffle";

const KebabButton = ({ handleExit }) => {
  // param id
  const { id } = useParams();
  // context
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
  
  // email & room code
  const email = Cookies.get("email");
  const roomCode = id || sessionStorage.getItem("roomCode");
  const isSolo = playerMode === PLAYER_MODE.SOLO;

  // local state
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const nav = useNavigate();

  /**
   * Toggle Drawer
   */
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Pins the current song to LocalStorage so it can be retrieved later
   */
  const handlePinSong = () => {
    try {
      if (!currentPlaying) return;
      
      const pinnedSongs = JSON.parse(localStorage.getItem(localStorage_pinSongs)) || [];
      
      // Prevent pinning the same song multiple times
      const isAlreadyPinned = pinnedSongs.some((song) => song.id === currentPlaying.id);
      
      if (!isAlreadyPinned) {
        localStorage.setItem(localStorage_pinSongs, JSON.stringify([...pinnedSongs, currentPlaying]));
      }
      
      setIsOpen(false); // Close drawer on success
    } catch (error) {
      console.error("Failed to pin song:", error);
    }
  };

  // Solo Options Configuration
  const soloOptions = [
    {
      icon: <HiOutlineQueueList size={25} />,
      text: "Add to Queue",
      onClick: () => {
        // Fallback to thumbnail if image is missing
        const trackImg = currentPlaying?.image || thumbnail; 
        addToQueue(trackImg, currentPlaying.title, currentPlaying.id, currentPlaying.channelName, videoIds, "Solo Playing", currentPlaying.artistId, playerMode, setVideoIds, setCurrentPlaying);
        setIsOpen(false); // 🐛 FIX: Close drawer so the user knows it worked
      }
    },
    {
      label: "Shuffle",
      icon: <IoShuffleOutline color='text-gray-400' size={23} />,
      text: "Added to Shuffle",
      onClick: () => shuffle({
        newSongs: {
          image: currentPlaying?.image,
          title,
          id,
          channelName: currentPlaying?.channelName,
          artistId: currentPlaying?.artistId,
          playedBy: Cookies.get('name') || "Solo Player"
        },
        queuedSongs: videoIds,
        playerMode,
        setVideoIds
      })
    },
    {
      icon: <VscPinned size={25} strokeWidth="0.1" />,
      text: "Pin Song",
      onClick: handlePinSong // 🐛 NEW: Pin functionality
    },
    {
      icon: <IoIosHeartEmpty size={25} strokeWidth='0.2' />,
      text: "Add to Liked songs",
      onClick: () => {
        // TODO: Add your Liked Songs logic here
        console.log("Add to Liked");
        setIsOpen(false);
      }
    },
    {
      icon: <HiOutlineCollection strokeWidth="1.5" size={25} />,
      text: "Add to Playlist",
      onClick: () => {
        // TODO: Add your Playlist logic here
        console.log("Add to Playlist");
        setIsOpen(false);
      }
    },
    {
      icon: <HiOutlineUser strokeWidth="1.5" size={25} />,
      text: "Go to artist",
      onClick: () => {
        setIsOpen(false);
        if (currentPlaying?.artistId) {
          nav(`/artists/${currentPlaying.artistId}`); // Navigate to artist page
        }
      }
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
        className={`!bg-zinc-900 !text-slate-200 !h-[60%] !max-w-screen-sm ${
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
                <p className="flex items-center mt-1 gap-1 text-sm text-gray-500">
                  <IoPerson /> {!isSolo ? currentPlaying?.playedBy : currentPlaying?.channelName || "artist"}
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
              className="flex items-center gap-3 text-gray-300 cursor-pointer hover:text-white transition-colors p-2 -mx-2 rounded-lg hover:bg-zinc-800 mt-2"
            >
              <span className="text-gray-400">{option.icon}</span>
              {option.text}
            </div>
          ))}
          
          {email === admin.email && !isSolo && <ChangeRoomVisibility />}
          
          {!isSolo && (
            <div
              className="flex items-center gap-3 text-gray-300 mt-2 cursor-pointer hover:text-white transition-colors p-2 -mx-2 rounded-lg hover:bg-zinc-800"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => handleExit(), 300); // Prevent backdrop freeze
              }}
            >
              <VscSignOut type="button" size={23} className="text-gray-400" />
              Exit Room
            </div>
          )}
          
          {email === admin.email && !isSolo && (
            <div
              className="flex items-center gap-3 text-red-500 mt-2 cursor-pointer hover:text-red-400 transition-colors p-2 -mx-2 rounded-lg hover:bg-zinc-800"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => setIsOpenDeleteModal(true), 300); // Prevent backdrop freeze
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