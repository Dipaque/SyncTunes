import React, { useEffect } from 'react';
import { IoChatbox, IoChatboxOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { GoHome, GoHomeFill } from "react-icons/go";
import { LuLibraryBig } from "react-icons/lu";
import { HiDatabase, HiOutlineDatabase  } from "react-icons/hi";
import { useStateContext } from '../Context/ContextProvider';
import { RxMagnifyingGlass } from 'react-icons/rx';
import { BsGear, BsGearFill, BsCompass, BsCompassFill } from "react-icons/bs";
import { getRoutes, localStorage_playerMode, PLAYER_MODE, ROUTE } from '../constants/index.js';
import { getPath } from '../utils/getPath';

const Sidebar = () => {
  const { pathName, setPathName, notification, playerMode } = useStateContext();
  const roomCode = sessionStorage.getItem("roomCode") || "";
  
  const isSolo = playerMode === PLAYER_MODE.SOLO;
  const ROUTE = getRoutes(isSolo);

  useEffect(() => {
    const getPathName = () => {
      setPathName(window.location.pathname);
    };
    getPathName();
  }, [window.location.pathname]);

  // 1. SOLO MODE VIEW
  const renderSoloSidebar = () => (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900/50 backdrop-blur-md border-t border-white/10 z-50 max-w-screen-sm">
      <div className="flex flex-row justify-between p-2 ps-6 pe-6 items-center max-w-screen-md mx-auto">
        <Link to={ROUTE.HOME} className='text-white text-[9px] no-underline text-center flex flex-col items-center'>
          {pathName.includes(ROUTE.HOME) ? <GoHomeFill size={25} color="white" /> : <GoHome size={25} color="white" />}
          Home
        </Link>

        <Link to={getPath(ROUTE.SEARCH)} className='text-white text-[9px] no-underline flex flex-col items-center'>
          {!pathName.includes("search") ? <RxMagnifyingGlass color="white" size={25} /> : <FaMagnifyingGlass color="white" size={20} />}
          Search
        </Link>

        <Link to={getPath(ROUTE.LIBRARY)} className='text-white text-[9px] no-underline flex flex-col items-center'>
          {!pathName.includes("library") ? <HiOutlineDatabase color="white" size={25} strokeWidth='1.3' /> : <HiDatabase color="white" size={25} />}
          Library
        </Link>

        <Link to={ROUTE.SETTINGS} className='text-white text-[9px] no-underline flex flex-col items-center'>
          {pathName.includes("settings") ? <BsGearFill size={20} color="white" /> : <BsGear size={20} color="white" />}
          Settings
        </Link>
      </div>
    </div>
  );

  // 2. JAM MODE (IN ROOM) VIEW
  const renderJamInRoomSidebar = () => (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900/50 backdrop-blur-md border-t border-white/10 z-50 max-w-screen-sm">
      <div className="flex flex-row justify-between p-2 ps-3 pe-3 items-center max-w-screen-md mx-auto">
        <Link to={getPath(ROUTE.PLAYER, roomCode)} className='text-white text-[9px] no-underline text-center flex flex-col items-center'>
          {pathName.includes("player") ? <GoHomeFill size={25} color="white" /> : <GoHome size={25} color="white" />}
          Home
        </Link>

        <Link to={getPath(ROUTE.SEARCH, roomCode)} className='text-white text-[9px] no-underline flex flex-col items-center'>
          {!pathName.includes("search") ? <RxMagnifyingGlass color="white" size={25} /> : <FaMagnifyingGlass color="white" size={20} />}
          Search
        </Link>

        <Link to={getPath(ROUTE.CHAT, roomCode)} className="relative text-white text-[9px] no-underline flex flex-col items-center">
          {notification > 0 && (
            <div className="h-1 w-1 bg-white text-black absolute top-0 left-5 text-xs px-1.5 py-0.5 rounded-full p-1"></div>
          )}
          {pathName.includes("chat") ? <IoChatbox size={25} color="white" /> : <IoChatboxOutline size={25} color="white" />}
          Chat
        </Link>

        <Link to={ROUTE.SETTINGS} className='text-white text-[9px] no-underline flex flex-col items-center'>
          {pathName.includes("settings") ? <BsGearFill size={20} color="white" /> : <BsGear size={20} color="white" />}
          Settings
        </Link>
      </div>
    </div>
  );

  // 3. JAM MODE (NOT IN ROOM YET) VIEW
  const renderJamNoRoomSidebar = () => (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900/50 backdrop-blur-md border-t border-white/10 z-50 max-w-screen-sm">
      <div className="flex items-center justify-between text-white p-2 ps-6 pe-6 max-w-screen-md mx-auto">
        <Link to={ROUTE.HOME} className='text-white text-[9px] no-underline text-center flex flex-col items-center'>
          {pathName.includes("home") ? <GoHomeFill size={25} color="white" /> : <GoHome size={25} color="white" />}
          Home
        </Link>

        <Link to={ROUTE.EXPLORE} className='text-white text-[9px] no-underline text-center flex flex-col items-center'>
          {pathName.includes("explore") ? <BsCompassFill size={20} color="white" /> : <BsCompass size={20} color="white" />}
          Explore
        </Link>

        <Link to={ROUTE.SETTINGS} className='text-white text-[9px] no-underline text-center flex flex-col items-center'>
          {pathName.includes("settings") ? <BsGearFill size={20} color="white" /> : <BsGear size={20} color="white" />}
          Settings
        </Link>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      {isSolo 
        ? renderSoloSidebar() 
        : (roomCode ? renderJamInRoomSidebar() : renderJamNoRoomSidebar())
      }
    </React.Fragment>
  );
};

export default Sidebar;