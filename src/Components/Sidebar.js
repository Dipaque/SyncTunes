import React,{useEffect } from 'react'
import Cookies from 'js-cookie';
import { IoChatbox, IoChatboxOutline } from "react-icons/io5";
import { Link, } from 'react-router-dom';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { GoHome, GoHomeFill, GoPerson } from "react-icons/go";
import { useStateContext } from '../Context/ContextProvider';
import { RxMagnifyingGlass } from 'react-icons/rx'
import { BsGear, BsGearFill, BsCompass, BsCompassFill } from "react-icons/bs";
const Sidebar = () => {
  const {pathName,setPathName,notification}=useStateContext()
  const roomCode = sessionStorage.getItem("roomCode");
  useEffect(()=>{
    const getPathName=()=>{
      setPathName(window.location.pathname)
    }
    getPathName()
  },[window.location.pathname])
  return (
    <React.Fragment>
    {roomCode ? (
      <div className="fixed bottom-0 left-0 w-full bg-zinc-900/50 backdrop-blur-md border-t border-white/10 z-50">
        <div className="flex flex-row justify-between p-2 ps-3 pe-3 items-center max-w-screen-md mx-auto">
          <Link to={`/room/${roomCode}/player`} className='text-white text-[9px] no-underline text-center flex flex-col items-center'>
            {pathName.includes(`/room/${roomCode}/player`) ? (
              <GoHomeFill size={25} color="white" />
            ) : (
              <GoHome size={25} color="white" />
            )}
            Home
          </Link>
  
          <Link to={`/room/${roomCode}/search`} className='text-white text-[10px] no-underline flex flex-col items-center'>
            {!pathName.includes("search") ? (
              <RxMagnifyingGlass color="white" size={25} />
            ) : (
              <FaMagnifyingGlass color="white" size={20} />
            )}
            Search
          </Link>
  
          <Link to={`/room/${roomCode}/chat`} className="relative text-white text-[10px] no-underline flex flex-col items-center">
            {notification > 0 && (
              <div className="badge bg-white text-black absolute -top-2 left-4 text-xs px-1.5 py-0.5 rounded-full">
               </div>
            )}
  
            {pathName.includes("chat") ? (
              <IoChatbox size={25} color="white" />
            ) : (
              <IoChatboxOutline size={25} color="white" />
            )}
            Chat
          </Link>
  
          <Link to="/settings" className='text-white text-[10px] no-underline flex flex-col items-center'>
          {pathName.includes("settings") ? (
              <BsGearFill size={20} color="white" />
            ) : (
              <BsGear size={20} color="white" />
            )}
            Settings
          </Link>
        </div>
      </div>
    ) : (
      <div className="fixed bottom-0 left-0 w-full bg-zinc-900/50 backdrop-blur-md border-t border-white/10 z-50">
        <div className="flex items-center justify-between text-white p-2 ps-3 pe-3 max-w-screen-md mx-auto">
          <Link to="/home" className='text-white text-[10px] no-underline text-center flex flex-col items-center'>
            {pathName.includes("home") ? (
              <GoHomeFill size={25} color="white" />
            ) : (
              <GoHome size={25} color="white" />
            )}
            Home
          </Link>
  
          <Link to="/explore" className='text-white text-[10px] no-underline text-center flex flex-col items-center'>
            {pathName.includes("explore") ? (
              <BsCompassFill size={20} color="white" />
            ) : (
              <BsCompass size={20} color="white" />
            )}
            Explore
          </Link>
  
          <Link to="/settings" className='text-white text-[10px] no-underline text-center flex flex-col items-center'>
            {pathName.includes("settings") ? (
              <BsGearFill size={20} color="white" />
            ) : (
              <BsGear size={20} color="white" />
            )}
            Settings
          </Link>
        </div>
      </div>
    )}
  </React.Fragment>
  )
}

export default Sidebar