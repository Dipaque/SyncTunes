import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// import icons
import { IoChatbox, IoChatboxOutline, IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { GoHome, GoHomeFill } from "react-icons/go";
import { RxMagnifyingGlass } from 'react-icons/rx';
import { BsGear, BsGearFill, BsCompass, BsCompassFill } from "react-icons/bs";

// import context provider
import { useStateContext } from '../Context/ContextProvider';

// import constants & utils
import { getRoutes, PLAYER_MODE } from '../constants/index.js';
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

  // Shared classes for all Nav Links to prevent layout shifts
  const navLinkStyle = "text-white text-[10px] leading-none no-underline flex flex-col items-center gap-1.5 w-14";
  const iconWrapper = "h-7 w-7 flex items-center justify-center relative";

  // 1. SOLO MODE VIEW
  const renderSoloSidebar = () => (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900/50 backdrop-blur-md border-t border-white/10 z-50 max-w-screen-sm">
      <div className="flex flex-row justify-between p-2 ps-6 pe-6 items-center max-w-screen-md mx-auto">
        
        <Link to={ROUTE.HOME} className={navLinkStyle}>
          <div className={iconWrapper}>
            {pathName.includes(ROUTE.HOME) ? <GoHomeFill size={26} color="white" /> : <GoHome size={26} color="white" />}
          </div>
          <span>Home</span>
        </Link>

        <Link to={getPath(ROUTE.SEARCH)} className={navLinkStyle}>
          <div className={iconWrapper}>
            {!pathName.includes("search") ? <RxMagnifyingGlass color="white" size={26} /> : <FaMagnifyingGlass color="white" size={22} />}
          </div>
          <span>Search</span>
        </Link>

        <Link to={getPath(ROUTE.LIBRARY)} className={navLinkStyle}>
          <div className={iconWrapper}>
            {!pathName.includes("library") ? <IoBookmarkOutline color="white" size={25} strokeWidth='1.3' /> : <IoBookmark color="white" size={25} />}
          </div>
          <span>Library</span>
        </Link>

        <Link to={ROUTE.SETTINGS} className={navLinkStyle}>
          <div className={iconWrapper}>
            {pathName.includes("settings") ? <BsGearFill size={22} color="white" /> : <BsGear size={22} color="white" />}
          </div>
          <span>Settings</span>
        </Link>
        
      </div>
    </div>
  );

  // 2. JAM MODE (IN ROOM) VIEW
  const renderJamInRoomSidebar = () => (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900/50 backdrop-blur-md border-t border-white/10 z-50 max-w-screen-sm">
      <div className="flex flex-row justify-between p-2 ps-3 pe-3 items-center max-w-screen-md mx-auto">
        
        <Link to={getPath(ROUTE.PLAYER, roomCode)} className={navLinkStyle}>
          <div className={iconWrapper}>
            {pathName.includes("player") ? <GoHomeFill size={26} color="white" /> : <GoHome size={26} color="white" />}
          </div>
          <span>Home</span>
        </Link>

        <Link to={getPath(ROUTE.SEARCH, roomCode)} className={navLinkStyle}>
          <div className={iconWrapper}>
            {!pathName.includes("search") ? <RxMagnifyingGlass color="white" size={26} /> : <FaMagnifyingGlass color="white" size={22} />}
          </div>
          <span>Search</span>
        </Link>

        <Link to={getPath(ROUTE.CHAT, roomCode)} className={navLinkStyle}>
          <div className={iconWrapper}>
            {/* Notification Dot scoped to the icon wrapper */}
            {notification > 0 && (
              <div className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-white rounded-full border border-zinc-900 z-10"></div>
            )}
            {pathName.includes("chat") ? <IoChatbox size={24} color="white" /> : <IoChatboxOutline size={24} color="white" />}
          </div>
          <span>Chat</span>
        </Link>

        <Link to={getPath(ROUTE.LIBRARY)} className={navLinkStyle}>
          <div className={iconWrapper}>
            {!pathName.includes("library") ? <IoBookmarkOutline color="white" size={25} strokeWidth='1.3' /> : <IoBookmark color="white" size={25} />}
          </div>
          <span>Library</span>
        </Link>

        <Link to={ROUTE.SETTINGS} className={navLinkStyle}>
          <div className={iconWrapper}>
            {pathName.includes("settings") ? <BsGearFill size={22} color="white" /> : <BsGear size={22} color="white" />}
          </div>
          <span>Settings</span>
        </Link>
        
      </div>
    </div>
  );

  // 3. JAM MODE (NOT IN ROOM YET) VIEW
  const renderJamNoRoomSidebar = () => (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900/50 backdrop-blur-md border-t border-white/10 z-50 max-w-screen-sm">
      <div className="flex items-center justify-between text-white p-2 ps-6 pe-6 max-w-screen-md mx-auto">
        
        <Link to={ROUTE.HOME} className={navLinkStyle}>
          <div className={iconWrapper}>
            {pathName.includes("home") ? <GoHomeFill size={26} color="white" /> : <GoHome size={26} color="white" />}
          </div>
          <span>Home</span>
        </Link>

        <Link to={ROUTE.EXPLORE} className={navLinkStyle}>
          <div className={iconWrapper}>
            {pathName.includes("explore") ? <BsCompassFill size={22} color="white" /> : <BsCompass size={22} color="white" />}
          </div>
          <span>Explore</span>
        </Link>

        <Link to={getPath(ROUTE.LIBRARY)} className={navLinkStyle}>
          <div className={iconWrapper}>
            {!pathName.includes("library") ? <IoBookmarkOutline color="white" size={25} strokeWidth='1.3' /> : <IoBookmark color="white" size={25} />}
          </div>
          <span>Library</span>
        </Link>

        <Link to={ROUTE.SETTINGS} className={navLinkStyle}>
          <div className={iconWrapper}>
            {pathName.includes("settings") ? <BsGearFill size={22} color="white" /> : <BsGear size={22} color="white" />}
          </div>
          <span>Settings</span>
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