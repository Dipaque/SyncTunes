import React, { useState } from "react";
import { Link } from "react-router-dom";

// Import icons
import {
  IoInformationCircleOutline,
  IoPeopleCircleOutline,
  IoSparklesOutline,
  IoListOutline,
  IoTimerOutline,
  IoLanguageOutline,
} from "react-icons/io5";

// Import components
import PageHeader from "../../Components/layout/PageHeader";
import Profile from "../../Components/settings/Profile";

// Import constants
import {
  localStorage_autoSuggest,
  localStorage_autoSuggestLimit,
  localStorage_fadeDuration,
  localStorage_syncPreferredLang,
} from "../../constants";

// Add this to your constants file, or use the raw string "sync_pastSongsLimit"
const localStorage_pastSongsLimit = "sync_pastSongsLimit";

const Settings = () => {

  // local state
  const [autoSuggest, setAutoSuggest] = useState(() => {
    const saved = localStorage.getItem(localStorage_autoSuggest);
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [suggestLimit, setSuggestLimit] = useState(() => {
    const saved = localStorage.getItem(localStorage_autoSuggestLimit);
    return saved !== null ? parseInt(saved, 10) : 5;
  });

  const [fadeDuration, setFadeDuration] = useState(() => {
    const saved = localStorage.getItem(localStorage_fadeDuration);
    return saved !== null ? parseInt(saved, 10) : 5;
  });

  // Initialize Past Songs Limit State (Default 20)
  const [pastSongsLimit, setPastSongsLimit] = useState(() => {
    const saved = localStorage.getItem(localStorage_pastSongsLimit);
    return saved !== null ? parseInt(saved, 10) : 5;
  });

  const [preferredLang, setPreferredLang] = useState(() => {
    return localStorage.getItem(localStorage_syncPreferredLang) || "English";
  });

  // --- Handlers ---
  const handleToggleAutoSuggest = () => {
    const newValue = !autoSuggest;
    setAutoSuggest(newValue);
    localStorage.setItem(localStorage_autoSuggest, JSON.stringify(newValue));
  };

  const handleLimitChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setSuggestLimit(val);
    localStorage.setItem(localStorage_autoSuggestLimit, val);
  };

  const handleFadeChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setFadeDuration(val);
    localStorage.setItem(localStorage_fadeDuration, val);
  };

  // Handler for Past Songs Limit
  const handlePastLimitChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setPastSongsLimit(val);
    localStorage.setItem(localStorage_pastSongsLimit, val);
  };

  /**
   * @function
   * Update the language in the localStorage
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} e
   */
  const handleLangChange = (e) => {
    const val = e.target.value;
    setPreferredLang(val);
    localStorage.setItem(localStorage_syncPreferredLang, val);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out Sync-Tunes 🎶",
          text: "🎵 Join my room on **Sync-Tunes** and vibe with me in real time! Listen together, sync the music, and enjoy the jam no matter where you are. 🔥Join now: https://sync-tunes.vercel.app",
          url: window.location.href,
        })
        .then(() => console.log("Thanks for sharing!"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  return (
    <>
      <div className="flex gap-0 bg-black flex-col overflow-y-auto no-underline pb-32">
        <PageHeader title={"Settings"} />

        <div className="ml-4 mr-4">
          <Profile />

          {/* <Link
            to={"/settings/liked"}
            className="text-white text-md flex justify-start items-center gap-2 mt-3 no-underline"
          >
            <IoHeartCircleOutline color="white" size={29} />
            <span className="flex-1">
              <span className="font-semibold text-[15px]">Liked Songs</span>{" "}
              <br />
              <span className="text-xs text-gray-400">
                Your Favorite playlist
              </span>
            </span>
          </Link>

          <Link
            to={"/settings/rooms"}
            className="text-white text-md flex justify-start items-center gap-2 mt-3 no-underline"
          >
            <IoBookmarkOutline color="white" size={26} />
            <span className="flex-1">
              <span className="font-semibold text-[15px]">My Rooms</span> <br />
              <span className="text-xs text-gray-400">
                Rooms created by you.
              </span>
            </span>
          </Link> */}

          {/* Auto Suggest Toggle */}
          <div
            className="text-white text-md flex justify-between items-center gap-2 mt-4 cursor-pointer"
            onClick={handleToggleAutoSuggest}
          >
            <div className="flex justify-start items-center gap-2">
              <IoSparklesOutline color="white" size={29} />
              <span className="flex-1">
                <span className="font-semibold text-[15px]">Auto Suggest</span>{" "}
                <br />
                <span className="text-xs text-gray-400">
                  Suggest songs when you play or select songs.
                </span>
              </span>
            </div>

            <div
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                autoSuggest ? "bg-[#1ed760]" : "bg-zinc-600"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  autoSuggest ? "translate-x-5" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>

          {/* Suggestion Limit */}
          {autoSuggest && (
            <div className="text-white text-md flex justify-between items-center gap-2 mt-2 ml-9">
              <div className="flex justify-start items-center gap-2">
                <IoListOutline color="#a1a1aa" size={20} />
                <span className="font-medium text-[14px] text-gray-300">
                  Suggestion Limit
                </span>
              </div>
              <select
                value={suggestLimit}
                onChange={handleLimitChange}
                className="form-select form-select-sm font-poppins !bg-zinc-800 text-white !border-zinc-700 shadow-none cursor-pointer focus:border-[#1ed760] focus:ring-0 w-auto"
              >
                <option value={5}>5 songs</option>
                <option value={10}>10 songs</option>
                <option value={20}>20 songs</option>
                <option value={30}>30 songs</option>
                <option value={40}>40 songs</option>
                <option value={50}>50 songs</option>
              </select>
            </div>
          )}

          {/* Past Songs Limit (Solo Mode) */}
          <div className="text-white text-md flex justify-between items-center gap-2 mt-4">
            <div className="flex justify-start items-center gap-2">
              <IoListOutline color="white" size={29} />
              <span className="flex-1">
                <span className="font-semibold text-[15px]">
                  Past Songs (Solo)
                </span>{" "}
                <br />
                <span className="text-xs text-gray-400">
                  Max previously played songs to keep in queue
                </span>
              </span>
            </div>
            <select
              value={pastSongsLimit}
              onChange={handlePastLimitChange}
              className="form-select form-select-sm font-poppins !bg-zinc-800 text-white !border-zinc-700 shadow-none cursor-pointer focus:border-[#1ed760] focus:ring-0 w-auto"
            >
              <option value={5}>5 songs</option>
              <option value={10}>10 songs</option>
              <option value={15}>15 songs</option>
              <option value={20}>20 songs</option>
            </select>
          </div>

          {/* Crossfade Duration Slider */}
          <div className="text-white text-md flex flex-col gap-2 mt-4">
            <div className="flex justify-start items-center gap-2">
              <IoTimerOutline color="white" size={29} />
              <span className="flex-1">
                <span className="font-semibold text-[15px]">Crossfade</span>{" "}
                <br />
                <span className="text-xs text-gray-400">
                  Fade out the last {fadeDuration} seconds of a song.
                </span>
              </span>
              <span className="text-sm font-bold text-[#1ed760] w-6 text-right">
                {fadeDuration}s
              </span>
            </div>

            <div className="ml-9 mr-1 mt-1">
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={fadeDuration}
                onChange={handleFadeChange}
                className="w-full h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-[#1ed760]"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1 px-1">
                <span>0s</span>
                <span>10s</span>
              </div>
            </div>
          </div>

          {/* Select user's preferred language */}
          <div className="text-white text-md flex justify-between items-center gap-2 mt-4">
            <div className="flex justify-start items-center gap-2">
              <IoLanguageOutline color="white" size={26} />
              <span className="flex-1">
                <span className="font-semibold text-nowrap">
                  Preferred Language
                </span>{" "}
                <br />
                <span className="text-xs text-gray-400">
                  Customize your home feed recommendations
                </span>
              </span>
            </div>
            <select
              value={preferredLang}
              onChange={handleLangChange}
              className="form-select form-select-sm font-poppins !bg-zinc-800 text-white !border-zinc-700 shadow-none cursor-pointer focus:border-[#1ed760] focus:ring-0 w-20"
            >
              <option value="English">English</option>
              <option value="Kollywood">Tamil (Kollywood)</option>
              <option value="Bollywood">Hindi (Bollywood)</option>
              <option value="Tollywood">Telugu (Tollywood)</option>
              <option value="Punjabi">Punjabi</option>
              <option value="K-Pop">K-Pop</option>
            </select>
          </div>

          <Link
            to={"/settings/about"}
            className="text-white text-md flex justify-start items-center gap-2 mt-4 no-underline"
          >
            <IoInformationCircleOutline color="white" size={29} />
            <span className="flex-1">
              <span className="font-semibold text-[15px]">About</span> <br />
              <span className="text-xs text-gray-400">
                Support &middot; Terms & Conditions
              </span>
            </span>
          </Link>

          <div
            className="text-white text-md flex justify-start items-center gap-2 mt-4 no-underline cursor-pointer"
            onClick={handleShare}
          >
            <IoPeopleCircleOutline color="white" size={29} />
            <span className="flex-1">
              <span className="font-semibold text-[15px]">Invite Friends</span>{" "}
              <br />
              <span className="text-xs text-gray-400">
                Share with your friends
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
