import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import axios from "axios";
import SongCard from "../Components/SongCard";
import "../App.css";
import Shimmer from "../Components/Shimmer";
import { GoChevronRight, GoChevronUp } from "react-icons/go";
import Toast from "../Components/Toast";
const Search = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastDisplay, setToastDisplay] = useState(false);
  const [data, setData] = useState([]);
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const options = {
      method: "GET",
      url: "https://youtube-search-and-download.p.rapidapi.com/search",
      params: {
        query: input + " songs",

        hl: "en",
        gl: "IN",
      },
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_YOUTUBE_KEY,
        "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setData(response.data.contents);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const shimmerArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  return (
    <div className="flex flex-col h-[calc(100vh-260px)]  -mt-8 overflow-hidden bg-black">
  <div className="text-white ml-5 text-xl">
    <b>Search</b>
  </div>

  <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 mt-2">
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
      onClick={(e) => handleSearch(e)}
    >
      <Icon path={mdiMagnify} size={1} />
    </button>
  </form>

  <div className="flex-1 overflow-y-auto mt-6 px-4">
    {!isLoading && data.length > 0 ? (
      data.map((obj, index) =>
        "video" in obj ? (
          <SongCard
            key={index}
            image={obj.video.thumbnails[0].url}
            title={obj.video.title}
            id={obj.video.videoId}
            channelName={obj.video.channelName}
            setToastDisplay={setToastDisplay}
            setToastMsg={setToastMsg}
          />
        ) : null
      )
    ) : isLoading ? (
      shimmerArr.map((_, index) => <Shimmer key={index} />)
    ) : (
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
    )}
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
