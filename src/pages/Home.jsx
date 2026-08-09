import React, { useState, useEffect } from "react";
import CreateRoom from "../Components/modal/CreateRoom";
import JoinRoom from "../Components/modal/JoinRoom";
import SoloView from "../Components/home/SoloView"; // Import the new component
import JamRoomView from "../Components/home/JamRoomView"; // Import the new component
import { useStateContext } from "../Context/ContextProvider";
import logo from '../assests/logo.png';
import { localStorage_pinSongs, localStorage_playerMode, localStorage_recentSearches, localStorage_syncPreferredLang, PLAYER_MODE } from "../constants";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

const Home = () => {
  const navigate = useNavigate();

  // global state
  const { setmodal_backdrop1, setmodal_backdrop,playerMode, setPlayerMode } = useStateContext();
  
  //  local state
  const [pinnedSongs, setPinnedSongs] = useState([]) // pinned songs from localStorage
  const [recentTracks, setRecentTracks] = useState([]);
  const [homeData, setHomeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. Fetch Local Recents
  useEffect(() => {
    const pinned = JSON.parse(localStorage.getItem(localStorage_pinSongs)) || []
    const recents = JSON.parse(localStorage.getItem(localStorage_recentSearches)) || [];
    setRecentTracks(recents.slice(0, 5));
    setPinnedSongs(pinned)
  }, []);

  // 2. Fetch YT-Music Home Data
  useEffect(() => {
    const fetchHomeData = async () => {
      const preferredLang = localStorage.getItem(localStorage_syncPreferredLang) || "";
      setIsLoading(true);
      try {
        const { data } = await apiClient.get(`/music/home?lang=${preferredLang}`);
        setHomeData(data);
      } catch (error) {
        console.error("Failed to load home content", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  // Handler to route to the correct page
  const handleItemClick = (item) => {
    const roomCode = sessionStorage.getItem("roomCode") || PLAYER_MODE.SOLO;
    
    if (item.type === "PLAYLIST") {
      navigate(`/room/${encodeURI(roomCode)}/playlists/${item.playlistId}`);
    } else if (item.type === "ALBUM") {
      navigate(`/room/${encodeURI(roomCode)}/albums/${item.albumId}`);
    }
  };

  const handlePlayerType = (mode) => {
    // Update state
    setPlayerMode(mode)

    localStorage.setItem(localStorage_playerMode, JSON.stringify(mode)) // Store the mode in the localStorage
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <CreateRoom />
      <JoinRoom />

      {/* Header & Logo */}
      <div className="flex items-center justify-between p-4 pt-6">
        <div className="flex items-center gap-2">
          <img src={logo} height={20} width={20} alt="logo" />
          <span className="text-xl font-bold text-gray-100">Sync-Tunes</span>
        </div>
      </div>

      {/* Pill Tab Navigation */}
      <div className="flex justify-center px-4 mb-6">
        <div className="relative flex bg-zinc-900 rounded-full p-1 w-full max-w-sm">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-50 rounded-full shadow-sm transition-transform duration-300 ease-out ${
              playerMode === PLAYER_MODE.SOLO ? "translate-x-0" : "translate-x-full"
            }`}
          ></div>

          <button
            onClick={() => handlePlayerType(PLAYER_MODE.SOLO)}
            className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
              playerMode === PLAYER_MODE.SOLO ? "text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Solo
          </button>
          
          <button
            onClick={() => handlePlayerType(PLAYER_MODE.JAM)}
            className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
              playerMode === PLAYER_MODE.JAM ? "text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Jam Room
          </button>
        </div>
      </div>

      {/* Dynamic Views */}
      {playerMode === PLAYER_MODE.SOLO && (
        <SoloView 
          pinnedSongs={pinnedSongs}
          recentTracks={recentTracks} 
          isLoading={isLoading} 
          homeData={homeData} 
          handleItemClick={handleItemClick} 
        />
      )}

      {playerMode === PLAYER_MODE.JAM && (
        <JamRoomView 
          setmodal_backdrop={setmodal_backdrop} 
          setmodal_backdrop1={setmodal_backdrop1} 
        />
      )}
    </div>
  );
};

export default Home;