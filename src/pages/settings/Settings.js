import React, { useState } from 'react';
import { 
  IoHeartCircleOutline, 
  IoInformationCircleOutline, 
  IoBookmarkOutline, 
  IoPeopleCircleOutline,
  IoSparklesOutline,
  IoListOutline,
  IoTimerOutline
} from 'react-icons/io5';
import Logout from '../../Components/settings/Logout';
import { Link } from 'react-router-dom';
import PageHeader from '../../Components/layout/PageHeader';
import Profile from '../../Components/settings/Profile';
import { localStorage_autoSuggest, localStorage_autoSuggestLimit, localStorage_fadeDuration } from '../../constants';

const Settings = () => {
  // 1. Initialize Auto Suggest State
  const [autoSuggest, setAutoSuggest] = useState(() => {
    const saved = localStorage.getItem(localStorage_autoSuggest);
    return saved !== null ? JSON.parse(saved) : true;
  });

  // 2. Initialize Suggestion Limit State (Default 20)
  const [suggestLimit, setSuggestLimit] = useState(() => {
    const saved = localStorage.getItem(localStorage_autoSuggestLimit);
    return saved !== null ? parseInt(saved, 10) : 20;
  });

  // 3. Initialize Fade Duration State (Default 5s)
  const [fadeDuration, setFadeDuration] = useState(() => {
    const saved = localStorage.getItem(localStorage_fadeDuration);
    return saved !== null ? parseInt(saved, 10) : 5;
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
      <div className='flex gap-0 bg-black flex-col overflow-y-auto no-underline pb-5'>
        <PageHeader title={"Settings"} />
        
        <div className='ml-4 mr-4'>
          <Profile />
          
          <Link to={"/settings/liked"} className='text-white text-md flex justify-start items-center gap-2 mt-3 no-underline'>
            <IoHeartCircleOutline color='white' size={29} />
            <span className='flex-1'>
              <span className='font-semibold text-[15px]'>Liked Songs</span> <br />
              <span className='text-xs text-gray-400'>Your Favorite playlist</span>
            </span>
          </Link>
          
          <Link to={"/settings/rooms"} className='text-white text-md flex justify-start items-center gap-2 mt-3 no-underline'>
            <IoBookmarkOutline color='white' size={26} />
            <span className='flex-1'>
              <span className='font-semibold text-[15px]'>My Rooms</span> <br />
              <span className='text-xs text-gray-400'>Rooms created by you.</span>
            </span>
          </Link>

          {/* Auto Suggest Toggle */}
          <div 
            className='text-white text-md flex justify-between items-center gap-2 mt-4 cursor-pointer' 
            onClick={handleToggleAutoSuggest}
          >
            <div className='flex justify-start items-center gap-2'>
              <IoSparklesOutline color='white' size={29} />
              <span className='flex-1'>
                <span className='font-semibold text-[15px]'>Auto Suggest</span> <br />
                <span className='text-xs text-gray-400'>Suggest songs when you play or select songs.</span>
              </span>
            </div>
            
            <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${autoSuggest ? 'bg-[#1ed760]' : 'bg-zinc-600'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${autoSuggest ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
          </div>

          {/* Conditional Suggestion Limit (Only visible if Auto Suggest is ON) */}
          {autoSuggest && (
            <div className='text-white text-md flex justify-between items-center gap-2 mt-2 ml-9'>
              <div className='flex justify-start items-center gap-2'>
                <IoListOutline color='#a1a1aa' size={20} />
                <span className='font-medium text-[14px] text-gray-300'>Suggestion Limit</span>
              </div>
              <select 
                value={suggestLimit} 
                onChange={handleLimitChange} 
                className='form-select form-select-sm font-poppins !bg-zinc-800 text-white !border-zinc-700 shadow-none cursor-pointer focus:border-[#1ed760] focus:ring-0 w-auto'              >
                <option value={5}>5 songs</option>
                <option value={10}>10 songs</option>
                <option value={20}>20 songs</option>
                <option value={30}>30 songs</option>
                <option value={40}>40 songs</option>
                <option value={50}>50 songs</option>
              </select>
            </div>
          )}

          {/* Crossfade Duration Slider */}
          <div className='text-white text-md flex flex-col gap-2 mt-4'>
            <div className='flex justify-start items-center gap-2'>
              <IoTimerOutline color='white' size={29} />
              <span className='flex-1'>
                <span className='font-semibold text-[15px]'>Crossfade</span> <br />
                <span className='text-xs text-gray-400'>Fade out the last {fadeDuration} seconds of a song.</span>
              </span>
              <span className='text-sm font-bold text-[#1ed760] w-6 text-right'>{fadeDuration}s</span>
            </div>
            
            <div className="ml-9 mr-1 mt-1">
              <input 
                type="range" 
                min="5" 
                max="10" 
                step="1" 
                value={fadeDuration} 
                onChange={handleFadeChange}
                className="w-full h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-[#1ed760]" 
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1 px-1">
                <span>5s</span>
                <span>10s</span>
              </div>
            </div>
          </div>
          
          <Link to={"/settings/about"} className='text-white text-md flex justify-start items-center gap-2 mt-4 no-underline'>
            <IoInformationCircleOutline color='white' size={29} />
            <span className='flex-1'>
              <span className='font-semibold text-[15px]'>About</span> <br />
              <span className='text-xs text-gray-400'>Support &middot; Terms & Conditions</span>
            </span>
          </Link>
          
          <div className='text-white text-md flex justify-start items-center gap-2 mt-4 no-underline cursor-pointer' onClick={handleShare}>
            <IoPeopleCircleOutline color='white' size={29} />
            <span className='flex-1'>
              <span className='font-semibold text-[15px]'>Invite Friends</span> <br />
              <span className='text-xs text-gray-400'>Share with your friends</span>
            </span>
          </div>
          
        </div>
        <Logout />
      </div>
      
    </>
  )
}

export default Settings;