import React, { useState, useEffect } from "react";
import { useStateContext } from "../Context/ContextProvider";
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import { HiOutlineQueueList } from "react-icons/hi2";
import { fontFamily } from "../constants";
import { getUniqueObjectsById } from "../Functions/removeDupes";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import { IoPause, IoPlay } from "react-icons/io5";

const QueueDrawer = ({ handlePlay, handlePause }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setSongsList, songsList, currentPlaying, isPause } =
    useStateContext();
  const roomCode = sessionStorage.getItem("roomCode");
  useEffect(() => {
    const docRef = doc(db, "room", roomCode);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        const data = snapshot.data();
        if (data && Array.isArray(data.currentSong)) {
          const uniqueSongs = getUniqueObjectsById(data.currentSong);
          setSongsList(uniqueSongs);
        } else {
          console.warn("currentSong is missing or not an array");
        }
      },
      (error) => {
        console.error("Error fetching songs:", error);
      }
    );

    return () => unsubscribe();
  }, [roomCode]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <React.Fragment>
      <HiOutlineQueueList
        size={20}
        cursor={"pointer"}
        className="text-white hover:text-slate-400"
        onClick={handleOpen}
      />
      <Offcanvas
        className={`!bg-zinc-900 !text-slate-200 !h-[50%] ${
          isOpen ? "!animate-drawer" : "!animate-slide-down"
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
        <OffcanvasHeader>
          <h6 className="text-sm font-bold">Queue</h6>
          <p className="text-zinc-700 text-sm">
            Tracks selected by room members
          </p>
        </OffcanvasHeader>
        <OffcanvasBody>
          {songsList.map((song, i) => (
            <div key={i} className="flex items-center gap-2 mb-4">
              <img
                src={song.image || ""}
                alt="thumbnail"
                className="h-12 w-16"
              />
              <span className="flex items-start gap-2">
                {currentPlaying.id === song.id && !isPause ? (
                  <div class="sound-bars">
                    <div class="bar bar1"></div>
                    <div class="bar bar2"></div>
                    <div class="bar bar3"></div>
                  </div>
                ) : (
                  currentPlaying.id === song.id &&
                  isPause && <div className="text-slate-200 text-lg">...</div>
                )}
                <div className="flex-1">
                  <div className="line-clamp-1">
                    {song.title || "Song name"}
                  </div>
                  <p className="text-xs">{song.channelName || "artist"}</p>
                </div>
              </span>
              {currentPlaying.id === song.id && (
                <>
                  {isPause ? (
                    <div
                      className="bg-slate-200 rounded-full p-2"
                      onClick={handlePlay}
                    >
                      {" "}
                      <IoPlay size={16} color="black" />
                    </div>
                  ) : (
                    <div
                      className="bg-slate-200 rounded-full p-2"
                      onClick={handlePause}
                    >
                      {" "}
                      <IoPause size={16} color="black" />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </OffcanvasBody>
      </Offcanvas>
    </React.Fragment>
  );
};

export default QueueDrawer;
