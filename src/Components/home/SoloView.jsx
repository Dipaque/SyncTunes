import React from "react";
import { IoPlayCircle, IoPeopleOutline } from "react-icons/io5";
import { VscPinned } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { getRoutes, localStorage_currentPlaying, localStorage_soloQueue, PLAYER_MODE } from "../../constants"; 
import { getPath } from "../../utils/getPath";
import { useStateContext } from "../../Context/ContextProvider";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import Cookies from "js-cookie"
import playSong from "../../Functions/playSong";

const SoloView = ({ recentTracks, pinnedSongs = [], isLoading, homeData, handleItemClick }) => {
  const nav = useNavigate();
  const { playerMode, videoIds, setVideoIds, setCurrentPlaying, setTitle, setArtist, setPlayedBy, setThumbnail, setIsPause } = useStateContext();
  
  // Dynamic Route Generation
  const isSolo = playerMode === PLAYER_MODE.SOLO;
  const ROUTE = getRoutes(isSolo);
  const roomCode = sessionStorage.getItem("roomCode") || "";

  // Smart Routing Handler
  const handleRouting = (item) => {
    // Normalize type (Handle both API data and local storage formats)
    const itemType = item.type?.toUpperCase();

    if (itemType === "ALBUM") {
      const id = item.albumId || item.browseId || item.id;
      nav(getPath(ROUTE.ALBUM, roomCode).replace(":album", id));
    } 
    else if (itemType === "PLAYLIST") {
      const id = item.playlistId || item.browseId || item.id;
      nav(getPath(ROUTE.PLAYLIST, roomCode).replace(":playlist", id));
    } 
    else if (itemType === "ARTIST") {
      const id = item.artistId || item.browseId || item.id;
      nav(getPath(ROUTE.ARTIST, roomCode).replace(":artist", id));
    } 
    else {
      // prepare params song details
      const track = {
        title: item?.title || item?.name, 
        id: item?.videoId, 
        image:item.thumbnails?.[item.thumbnails?.length-1]?.url || item.thumbnail, 
        channelName: item?.artist?.name, 
        artistId: item?.artist?.artistId
      }

      // prepare params object
      const stateSetters = {
        videoIds, 
        setVideoIds, 
        setCurrentPlaying, 
        setTitle, 
        setArtist, 
        setPlayedBy, 
        setThumbnail
      }

      // Play song
      playSong({track, stateSetters, isSoloMode: isSolo, onSuccess:()=>{
        setIsPause(false);
        nav(getPath(ROUTE.PLAYER, roomCode));
      }})
    }
  };

  return (
    <div className="px-4 flex flex-col gap-8 animate-fade-in pb-28">
      
      {/* Pinned Songs Section */}
      {pinnedSongs.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <VscPinned size={23} strokeWidth={0.4} className=" rotate-45" />
            <h2 className="text-lg font-bold text-white">Pinned Songs</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2 snap-x">
            {pinnedSongs.map((track, idx) => (
              <div 
                key={idx} 
                onClick={() => handleRouting(track)}
                className="flex flex-col gap-2 min-w-[120px] max-w-[120px] cursor-pointer group snap-start"
              >
                <div className="relative aspect-square overflow-hidden rounded-md bg-zinc-800 border-transparent  transition-colors">
                  <img
                    src={track.image || track.thumbnails?.[0]?.url}
                    alt={track.title || track.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <IoPlayCircle size={40} className="text-[#1ed760] drop-shadow-lg" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white truncate">{track.title || track.name}</p>
                  <p className="text-xs text-gray-400 truncate">{track.artist || track.channelName}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Jump Back In (Recent Tracks) */}
      {recentTracks.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-white mb-3">Jump Back In</h2>
          <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2 snap-x">
            {recentTracks.map((track, idx) => (
              <div 
                key={idx} 
                onClick={() => handleRouting(track)}
                className="flex flex-col gap-2 min-w-[120px] max-w-[120px] cursor-pointer group snap-start"
              >
                <div className="relative aspect-square overflow-hidden rounded-md bg-zinc-800">
                  <img
                    src={track.image}
                    alt={track.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <IoPlayCircle size={40} className="text-white drop-shadow-lg" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white truncate">{track.title}</p>
                  <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dynamic Sections from YouTube Music API */}
      {isLoading ? (
        // Shimmer Loading State
        [1, 2, 3].map((skeletonIdx) => (
          <section key={`skel-${skeletonIdx}`} className="mb-4">
            <div className="h-5 w-48 bg-zinc-800 rounded animate-pulse mb-4"></div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex flex-col gap-2 min-w-[140px]">
                  <div className="aspect-square bg-zinc-800 rounded-lg animate-pulse"></div>
                  <div className="h-3 w-3/4 bg-zinc-800 rounded animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-zinc-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </section>
        ))
      ) : (
        // Render Actual API Sections
        homeData.map((section, idx) => (
          <section key={idx} className="mb-2">
            <h2 className="text-lg font-bold text-white mb-3">{section.title}</h2>

            <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 snap-x">
              {section.contents.map((item, itemIdx) => (
                <div
                  key={item.playlistId || item.albumId || item.videoId || itemIdx}
                  onClick={() => handleRouting(item)}
                  className="flex flex-col gap-2 min-w-[140px] max-w-[140px] cursor-pointer group snap-start"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-800">
                    {item.thumbnails ? (
                      <img
                        src={item.thumbnails?.[item.thumbnails?.length-1]?.url || item.thumbnail}
                        alt={item.name || item.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-xs text-zinc-500">
                        {item.type}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <IoPlayCircle size={44} className="text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white truncate">{item.name || item.title}</p>
                    <p className="text-xs text-gray-400 capitalize truncate">
                      {item.type === "SONG" && item.artist?.name ? item.artist.name : item.type?.toLowerCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      {/* Community & Following Placeholder */}
      <section className="mb-8 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Friends Activity</h2>
        </div>
        <div className="bg-zinc-900 rounded-xl p-5  flex items-center gap-4">
          <div className="bg-zinc-800 p-3 rounded-full">
            <IoPeopleOutline size={24} className="text-gray-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">Discover Users</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Follow friends to spectate their solo sessions or join their active jam rooms.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SoloView;