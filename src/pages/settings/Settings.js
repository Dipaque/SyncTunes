import React from 'react'
import { IoHeartCircleOutline, IoInformationCircleOutline, IoBookmarkOutline, IoPeopleCircleOutline   } from 'react-icons/io5';
import Logout from '../../Components/settings/Logout';
import { Link } from 'react-router-dom';
import PageHeader from '../../Components/layout/PageHeader';
import Profile from '../../Components/settings/Profile';
const Settings = () => {

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out Sync-Tunes 🎶",
          text:
            "🎵 Join my room on **Sync-Tunes** and vibe with me in real time!Listen together, sync the music, and enjoy the jam no matter where you are. 🔥Join now: https://sync-tunes.vercel.app",
          url: window.location.href, // or your app URL e.g., 'https://sync-tunes.vercel.app'
        })
        .then(() => console.log("Thanks for sharing!"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  return (
    <>
    <div className='flex gap-0 bg-black flex-col   overflow-y-auto no-underline'>

    <PageHeader title={"Settings"} />
    <div className='ml-4'>
     <Profile />
      <Link to={"/settings/liked"} className='text-white  text-md flex justify-start  items-center gap-2  mt-3 no-underline'>
          <IoHeartCircleOutline color='white' size={29} />
          <span className='flex-1'>
          <span className='font-semibold text-[15px]'>Liked Songs</span> <br />
         <span className='text-xs text-gray-400'>Your Favorite playlist</span>
          </span>
      </Link>
        <Link to={"/settings/rooms"} className='text-white  text-md flex justify-start  items-center gap-2  mt-3 no-underline'>
          <IoBookmarkOutline color='white' size={26} />
          <span className='flex-1'>
          <span className='font-semibold text-[15px]'>My Rooms</span> <br />
         <span className='text-xs text-gray-400'>Rooms created by you.</span>
          </span>
        </Link>
        <Link to={"/settings/about"} className='text-white  text-md flex justify-start  items-center gap-2  mt-3 no-underline'>
          <IoInformationCircleOutline  color='white' size={29} />
          <span className='flex-1'>
          <span className='font-semibold text-[15px]'>About</span> <br />
         <span className='text-xs text-gray-400'>Support &middot; Terms & Conditions</span>
          </span>
        </Link>
        <div className='text-white  text-md flex justify-start  items-center gap-2  mt-3 no-underline' onClick={handleShare}>
        <IoPeopleCircleOutline    color='white' size={29} />
          <span className='flex-1'>
          <span className='font-semibold text-[15px]'>Invite Friends</span> <br />
         <span className='text-xs text-gray-400'>Share with your friends</span>
          </span>
        </div>
    </div>
    </div>
        <Logout />
    </>
  )
}

export default Settings