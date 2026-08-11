import React, { useState, useEffect } from "react";
import { useStateContext } from "../Context/ContextProvider";
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import { HiOutlineQueueList } from "react-icons/hi2";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { fontFamily, localStorage_currentPlaying, localStorage_soloQueue, PLAYER_MODE } from "../constants";
import { getUniqueObjectsById } from "../Functions/removeDupes";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { IoPause, IoPlay } from "react-icons/io5";
import NotFoundGraphic from "../assests/notFound";

const QueueDrawer = ({ handlePlay, handlePause }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setSongsList, songsList, currentPlaying, isPause, playerMode, setVideoIds, setCurrentPlaying } = useStateContext();
  const roomCode = sessionStorage.getItem("roomCode") || "";

  useEffect(() => {
    const fetchRoomData = async () => {
      if (playerMode === PLAYER_MODE.SOLO) {
        try {
          const savedQueue = localStorage.getItem(localStorage_soloQueue);
          
          // 1. Only parse if it exists and isn't the literal string "undefined"
          const parsedQueue = (savedQueue && savedQueue !== "undefined") 
            ? JSON.parse(savedQueue) 
            : [];
            
          // 2. FORCE fallback to [] if the parsed result somehow isn't an array
          const localQueue = Array.isArray(parsedQueue) ? parsedQueue : [];
          
          setSongsList(localQueue);
        } catch (error) {
          console.error("Failed to parse solo queue from local storage:", error);
          setSongsList([]); // Fallback on crash
        }
      } else {
        try {
          const docRef = doc(db, "room", roomCode);
          const snapshot = await getDoc(docRef);
    
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data && Array.isArray(data.currentSong)) {
              const uniqueSongs = getUniqueObjectsById(data.currentSong);
              setSongsList(uniqueSongs);
            } else {
              setSongsList([]); // Fallback if Firestore data is malformed
            }
          }
        } catch (error) {
          console.error("Error fetching songs:", error);
          setSongsList([]);
        }
      }
    };
  
    fetchRoomData();
  }, [roomCode, playerMode, songsList]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  // 🐛 FIX 1: Determine the actual index of the currently playing song
  const getValidCurrentIndex = () => {
    const idx = currentPlaying?.queueIndex !== undefined 
      ? currentPlaying.queueIndex 
      : songsList?.findIndex((s) => s.id === currentPlaying?.id);
    return Math.max(0, idx !== -1 ? idx : 0);
  };

  const validCurrentIndex = getValidCurrentIndex();
  
  // 🐛 FIX 2: Slice the list to hide previously played songs from the UI
  const visibleSongs = songsList?.slice(validCurrentIndex);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    // These are relative to the VISIBLE array
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (destinationIndex === sourceIndex) return;

    // 🐛 FIX 3: Convert UI indices back to Absolute indices for the original array
    const absoluteSourceIndex = validCurrentIndex + sourceIndex;
    const absoluteDestinationIndex = validCurrentIndex + destinationIndex;

    const reorderedQueue = Array.from(songsList);
    
    // Extract & Insert using absolute indices
    const [movedItem] = reorderedQueue.splice(absoluteSourceIndex, 1);
    reorderedQueue.splice(absoluteDestinationIndex, 0, movedItem);

    let newPlayingIndex = currentPlaying?.queueIndex;

    // Shift the playing index if affected by the drag
    if (newPlayingIndex !== undefined) {
      if (absoluteSourceIndex === newPlayingIndex) {
        newPlayingIndex = absoluteDestinationIndex;
      } else if (absoluteSourceIndex < newPlayingIndex && absoluteDestinationIndex >= newPlayingIndex) {
        newPlayingIndex -= 1;
      } else if (absoluteSourceIndex > newPlayingIndex && absoluteDestinationIndex <= newPlayingIndex) {
        newPlayingIndex += 1;
      }
    } else {
      newPlayingIndex = reorderedQueue.findIndex((s) => s.id === currentPlaying?.id);
    }

    const updatedCurrentPlaying = {
      ...currentPlaying,
      queueIndex: newPlayingIndex
    };

    setVideoIds(reorderedQueue); 
    setSongsList(reorderedQueue);
    setCurrentPlaying(updatedCurrentPlaying);

    try {
      const isSolo = playerMode === PLAYER_MODE.SOLO;
      if (isSolo) {
        localStorage.setItem(localStorage_soloQueue, JSON.stringify(reorderedQueue));
        localStorage.setItem(localStorage_currentPlaying, JSON.stringify(updatedCurrentPlaying));
      } else {
        if (roomCode) {
          await updateDoc(doc(db, "room", roomCode), {
            currentSong: reorderedQueue,
            currentPlaying: updatedCurrentPlaying
          });
        }
      }
    } catch (err) {
      console.error("Failed to reorder playlist:", err);
    }
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
        className={`!bg-zinc-900 !text-slate-200 !h-[50%] !max-w-screen-sm ${
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
        <div className="border-1 border-gray-500 p-[1px] bg-gray-500 w-8 rounded-full mx-auto mt-3" onClick={handleOpen} />
        <OffcanvasHeader>
          <h6 className="font-bold">Queue</h6>
          <p className="text-gray-500 text-sm">
            Upcoming Tracks
          </p>
        </OffcanvasHeader>
        <OffcanvasBody className="-mt-7">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="playlist-droppable">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="w-full"
                >
                  {visibleSongs.length > 0 ? (
                    visibleSongs.map((song, i) => {
                      
                      // 🐛 FIX 4: Calculate the absolute index for verification & unique IDs
                      const absoluteIndex = validCurrentIndex + i;
                      const isExactlyThisSong = currentPlaying?.id === song.id && (currentPlaying?.queueIndex === absoluteIndex || currentPlaying?.queueIndex === undefined);

                      return (
                        <Draggable 
                          key={`${song.id || 'fallback'}-${absoluteIndex}`} 
                          draggableId={`${song.id || 'fallback'}-${absoluteIndex}`} 
                          index={i} // MUST be relative `i` for Drag/Drop to work
                        >
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center justify-between gap-2 mb-4 rounded-md transition-colors ${
                                snapshot.isDragging ? "bg-zinc-800 shadow-xl z-50 p-2 -mx-2" : ""
                              }`}
                            >
                              
                              <div className="flex flex-row gap-2 flex-1 min-w-0">
                                <img
                                  src={song.image || ""}
                                  alt="thumbnail"
                                  className="h-12 w-14 rounded-sm object-cover shrink-0"
                                />
                                <span className="flex items-start gap-2 flex-1 min-w-0">
                                  
                                  {isExactlyThisSong ? (
                                    !isPause ? (
                                      <div className="sound-bars shrink-0 mt-1">
                                        <div className="bar bar1"></div>
                                        <div className="bar bar2"></div>
                                        <div className="bar bar3"></div>
                                      </div>
                                    ) : (
                                      <div className="text-slate-200 text-lg shrink-0 mt-[-4px]">...</div>
                                    )
                                  ) : null}
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="line-clamp-1 text-sm font-medium">
                                      {song.title || "Song name"}
                                    </div>
                                    <p className="flex items-center gap-1 text-xs text-gray-500 mt-1 truncate">
                                      {playerMode === PLAYER_MODE.JAM ? song.playedBy : song?.channelName}
                                    </p>
                                  </div>
                                </span>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                {isExactlyThisSong && (
                                  <div
                                    className="bg-slate-200 rounded-full p-2 cursor-pointer hover:bg-white transition-colors"
                                    onClick={isPause ? handlePlay : handlePause}
                                  >
                                    {isPause ? (
                                      <IoPlay size={16} color="black" className="ml-0.5" />
                                    ) : (
                                      <IoPause size={16} color="black" />
                                    )}
                                  </div>
                                )}

                                <div 
                                  {...provided.dragHandleProps}
                                  className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-white p-1"
                                >
                                  <HiOutlineMenuAlt4 size={22} />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })
                  ) : (
                    <p className="text-zinc-500 mx-auto text-center text-sm pt-4">
                      <NotFoundGraphic className={"h-40 w-40 mx-auto"} />
                      No song played yet!
                    </p>
                  )}
                  {provided.placeholder} 
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </OffcanvasBody>
      </Offcanvas>
    </React.Fragment>
  );
};

export default QueueDrawer;