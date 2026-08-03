import React, { useState } from "react";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import SongCard from "../Components/SongCard";
import "../App.css";
import Toast from "../Components/Toast";
import { localStorage_recentSearches } from "../constants";
import apiClient from "../utils/apiClient";
import Spinner from "../Components/loading/Spinner";
import { useStateContext } from "../Context/ContextProvider";

const filters = ["ALL", "SONG", "VIDEO", "ARTIST", "ALBUM", "PLAYLIST"];

const Search = () => {

  // global state
  const {searchResult, setSearchResult} = useStateContext();

  // local state
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastDisplay, setToastDisplay] = useState(false);
  
  // Filter State
  const [activeFilter, setActiveFilter] = useState("ALL");
  
  // 1. Make recents a state variable with a lazy initializer
  const [recents, setRecents] = useState(() => {
    const savedRecents = localStorage.getItem(localStorage_recentSearches);
    return savedRecents ? JSON.parse(savedRecents) : [];
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);

    try {
      const response = await apiClient.get('/search', { 
        params: { q: input } 
      });

      setSearchResult(response.data);
    } catch (error) {
      console.error("Search error:", error);
      setToastMsg("Failed to fetch results");
      setToastDisplay(true);
      setTimeout(() => setToastDisplay(false), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Update state when clearing localStorage
  const clearAllRecents = () => {
    localStorage.setItem(localStorage_recentSearches, JSON.stringify([]));
    setRecents([]); // This triggers the re-render immediately
  };


  // Apply the selected filter
  const filteredData =
    activeFilter === "ALL"
      ? searchResult
      : searchResult?.filter((item) => item.type === activeFilter);

  return (
    <div className="flex flex-col h-screen pb-28 pt-3 overflow-hidden bg-black">

      {/* Header */}
      {recents?.length <= 0 && (
        <div className="text-white ml-5 text-xl">
          <b>Search</b>
        </div>
      )}

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border pl-2 pr-2 ml-5 w-60 bg-slate-50 rounded-lg text-sm p-2 outline-none text-black"
          placeholder="Find your track..."
        />
        <button
          type="submit"
          className="bg-slate-50 p-2 rounded-lg text-gray-500"
        >
          <Icon path={mdiMagnify} size={1} />
        </button>
      </form>

      {/* Pill Filters */}
      {searchResult?.length > 0 && (
        <div className="flex gap-2 mt-4 px-3 overflow-x-auto no-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              {filter.charAt(0) + filter.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      )}

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto mt-3 px-2">
        {!isLoading && filteredData?.length > 0 ? (
          filteredData?.map((obj, index) => {
            const itemId =
              obj.type === "SONG" || obj.type === "VIDEO"
                ? obj.videoId
                : obj.type === "ALBUM"
                ? obj.albumId
                : obj.type === "PLAYLIST"
                ? obj.playlistId
                : obj.type === "ARTIST"
                ? obj.artistId
                : null;
                
            const imageUrl =
              obj?.thumbnails?.[obj?.thumbnails?.length - 1]?.url ||
              obj?.thumbnails?.[0]?.url;
              
            const artistName = obj.artist?.name || obj.name;

            return (
              <SongCard
                key={itemId || index}
                id={itemId}
                type={obj.type}
                title={obj.name}
                image={imageUrl}
                channelName={artistName}
                setToastDisplay={setToastDisplay}
                setToastMsg={setToastMsg}
                isRecentRequired ={true}
                artistId={obj?.artist?.artistId}
              />
            );
          })
        ) : isLoading ? (
          // <div className="flex-1">
            <Spinner />
          // </div>
        ) : ( 
          // Recent history
          recents.length > 0 ? (
          <div className="text-slate-50 mx-3">
            <h2 className="text-xl font-bold mb-2 ">Recents</h2>
            {recents.map((history) => (
              <SongCard
                key={history.id}
                id={history?.id}
                type={history?.type}
                title={history?.title}
                image={history?.image}
                channelName={history?.artist}
                artistId={history?.artistId}
                setToastDisplay={setToastDisplay}
                setToastMsg={setToastMsg}
              />
            ))}

            <div
              className="w-fit mx-auto px-4 py-1 border border-zinc-800 font-semibold mt-3 mb-5 rounded-full text-xs cursor-pointer"
              onClick={clearAllRecents}
            >
              Clear recent history
            </div>
          </div>
          ): (
          <div className="flex flex-col justify-center items-center mt-14 m-3 text-slate-50">
            <img
              src={require("../assests/tape.png")}
              height={200}
              width={200}
              alt="tape"
            />
            <h5 className="mt-7">
              <b>Find your favorite tracks here</b>
            </h5>
            <p className="text-sm text-center">
              Listen to your favorite tracks and artists with your loved ones!
            </p>
          </div>
        ))}
      </div>

      {toastDisplay && (
        <div className="flex justify-center">
          <Toast message={toastMsg} showToast={toastDisplay} />
        </div>
      )}
    </div>
  );
};

export default Search;