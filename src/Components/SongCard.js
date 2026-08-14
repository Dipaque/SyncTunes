import React, { useState } from 'react';
import { useStateContext } from '../Context/ContextProvider';
import { db } from '../firebase-config';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { HiOutlineQueueList } from "react-icons/hi2";
import { IoEllipsisVertical, IoRepeatOutline, IoShuffleOutline, IoPlaySkipForwardOutline, IoCloseOutline } from 'react-icons/io5';
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap';
import addToQueue from '../Functions/addToQueue';
import shuffule from '../Functions/shuffle'; 
import playNext from '../Functions/playNext';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { formatText } from '../utils/formatText';
import { fontFamily, localStorage_recentSearches, getRoutes, PLAYER_MODE, localStorage_currentPlaying, localStorage_soloQueue, localStorage_pinSongs } from '../constants';
import { getPath } from '../utils/getPath';
import { VscPinned } from 'react-icons/vsc';
import { BsPinFill } from 'react-icons/bs';
import handlePin from '../Functions/handlePin';
import LikeEntity from './likes/LikeEntity';

const SongCard = ({ image, title, id, channelName, type, setToastDisplay, setToastMsg, isRecentRequired=false, artistId="", onRemoveRecent }) => {
  const { id: paramsId } = useParams();
  const nav = useNavigate();
  const roomCode = paramsId || sessionStorage.getItem("roomCode");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (e) => {
    if (e) e.stopPropagation();
    setDrawerOpen((prevState) => !prevState);
  };
  
  const { videoIds, setVideoIds, currentPlaying, setCurrentPlaying, isPause, setIsPause, playerMode, setTitle, setArtist, setThumbnail, setPlayedBy } = useStateContext();
  const isSong = !type || type === 'SONG';

  const addRecent = () => {
    if (!isRecentRequired) return;
    const recents = JSON.parse(localStorage.getItem(localStorage_recentSearches)) || [];
    const newRecent = { image, title, id, artist: channelName, artistId, type };
    const updatedRecents = [newRecent, ...recents.filter((item) => item.id !== id)];
    localStorage.setItem(localStorage_recentSearches, JSON.stringify(updatedRecents));
  };

  const handlePlay = async () => {
    const isSolo = playerMode === PLAYER_MODE.SOLO;
    const ROUTE = getRoutes(isSolo);
  
    if (type === 'ARTIST') {
      nav(getPath(ROUTE.ARTIST, roomCode).replace(':artist', id));
    } else if (type === 'ALBUM') {
      nav(getPath(ROUTE.ALBUM, roomCode).replace(':album', id));
    } else if (type === 'PLAYLIST') {
      nav(getPath(ROUTE.PLAYLIST, roomCode).replace(':playlist', id));
    } else {
      try {
        const selectedSong = {
          title, id, image, channelName, artistId, 
          playedBy: Cookies.get('name') || "Solo Player", 
          playedAt: Timestamp.now() 
        };
  
        localStorage.setItem(localStorage_currentPlaying, JSON.stringify(selectedSong));
  
        if (isSolo) {
          const localQueue = JSON.parse(localStorage.getItem(localStorage_soloQueue)) || [];
          localStorage.setItem(localStorage_soloQueue, JSON.stringify([...localQueue, selectedSong]));
          setVideoIds(prev => prev?.length > 0 ? [...prev, selectedSong] : [selectedSong]);
          setCurrentPlaying(selectedSong);
          setTitle(selectedSong.title);
          setArtist(selectedSong.channelName);
          setPlayedBy(selectedSong.playedBy);
          setThumbnail(selectedSong.image);
        } else {
          const newQueue = videoIds?.length > 0 ? [...videoIds, selectedSong] : [selectedSong];
          await updateDoc(doc(db, 'room', roomCode), { 
            currentSong: newQueue, 
            currentPlaying: selectedSong 
          });
        }
  
        setIsPause(false);
        nav(getPath(ROUTE.PLAYER, roomCode));
      } catch (err) {
        if (!isSolo && !roomCode) {
          setToastDisplay?.(true);
          setToastMsg?.('Join Room to play Songs');
          setTimeout(() => setToastDisplay?.(false), 4000);
        }
        console.log(err);
      }
    }
    addRecent();
  };

  const handleMenuAction = (actionCallback, toastMessage) => {
    actionCallback();
    addRecent();
    
    if (setToastDisplay && setToastMsg && toastMessage) {
      setToastDisplay(true);
      setToastMsg(toastMessage);
      setTimeout(() => setToastDisplay(false), 4000);
    }
    setDrawerOpen(false); 
  };

  const pinnedLookup = JSON.parse(localStorage.getItem(localStorage_pinSongs)) || {};
  const isPinned = !!pinnedLookup[id];
  
  const itemType = type ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() : "Song"; 
  
  const menuOptions = [
    {
      label: "Add to Liked Song",
      icon: <div className='-m-2'><LikeEntity id={id} type={"song"} iconSize={25} color='text-gray-400' songInfo={{image, title, id, channelName, artistId}}  /></div>,
      action: () => {return}
    },
    {
      label: "Play Next",
      icon: <IoPlaySkipForwardOutline color='text-gray-400' size={23} />,
      toast: "Added to Play next",
      action: () => playNext(image, title, id, channelName, videoIds, currentPlaying, Cookies.get('name'), artistId, playerMode, setVideoIds)
    },
    {
      label: "Add to Queue",
      icon: <HiOutlineQueueList color='text-gray-400' size={23} />,
      toast: "Added to Queue",
      action: () => addToQueue(image, title, id, channelName, videoIds, Cookies.get('name'), artistId, playerMode, setVideoIds, setCurrentPlaying)
    },
    {
      label: "Repeat",
      icon: <IoRepeatOutline color='text-gray-400' size={23} />,
      toast: "Added to Repeat",
      action: () => addToQueue(image, title, id, channelName, videoIds, Cookies.get('name'), artistId, playerMode, setVideoIds, setCurrentPlaying)
    },
    {
      label: "Shuffle",
      icon: <IoShuffleOutline color='text-gray-400' size={23} />,
      toast: "Added to Shuffle",
      action: () => shuffule(image, title, id, channelName, videoIds, Cookies.get('name'), artistId)
    },
    {
      label: isPinned ? `Unpin ${itemType}` : `Pin ${itemType}`,
      icon: isPinned ? <BsPinFill size={25} /> : <VscPinned size={25} strokeWidth="0.1" />,
      toast: isPinned ? `${itemType} Unpinned` : `${itemType} Pinned`,
      action: () =>{
         const song = { id, title, image, channelName, artistId, itemType }
         handlePin({song})
        }
    }
  ];

  const imageStyles = type === 'ARTIST' 
    ? 'rounded-full h-12 w-12 object-cover shrink-0' 
    : 'rounded-lg h-12 w-16 object-cover shrink-0';

  return (
    <div className='flex flex-row p-2 px-1 pe-1 items-center gap-3 text-white cursor-pointer w-full hover:bg-zinc-900/40 rounded-lg transition-colors'>
      <img src={image} className={imageStyles} onClick={handlePlay} alt={title} />
      
      <div className='flex-1 min-w-0 flex flex-col justify-center' onClick={handlePlay}>
        <div className="flex items-center gap-2 min-w-0">
          {currentPlaying?.id === id && !isPause ? (
            <div className="sound-bars shrink-0">
              <div className="bar bar1"></div>
              <div className="bar bar2"></div>
              <div className="bar bar3"></div>
            </div>
          ) : currentPlaying?.id === id && isPause ? (
            <div className="text-slate-200 text-sm font-bold shrink-0">...</div>
          ) : null}
          <p className='truncate text-sm font-medium m-0 text-white'>{title}</p>
        </div>
        <p className='truncate text-xs text-gray-400 m-0 mt-0.5'>
          {type ? `${formatText(type)} · ${channelName}` : channelName}
        </p>
      </div>

      {/* Individual Clear Button OR Standard Menu */}
      {onRemoveRecent ? (
        <div className='shrink-0'>
          <button 
            className='btn border-0 shadow-none focus:outline-none p-1 hover:bg-zinc-800 rounded-full transition-colors' 
            onClick={(e) => {
              e.stopPropagation(); // Prevents handlePlay from firing when clicking X
              onRemoveRecent(id);
            }}
          >
            <IoCloseOutline color='gray' size={22} />
          </button>
        </div>
      ) : isSong ? (
        <div className='shrink-0'>
          <button className='btn border-0 shadow-none focus:outline-none p-1' onClick={toggleDrawer}>
            <IoEllipsisVertical color='white' size={18} />
          </button>

          <Offcanvas 
            isOpen={drawerOpen} 
            toggle={toggleDrawer} 
            unmountOnClose={true}
            style={{ fontFamily: fontFamily, borderTopLeftRadius: "14px", borderTopRightRadius: "14px" }}
            direction="bottom"
            className="!bg-zinc-900 !text-slate-200 !h-auto !max-w-screen-sm !rounded-t-2xl !mx-auto"
          >
            <div className="border-1 border-zinc-600 p-[2px] bg-zinc-600 w-10 rounded-full mx-auto mt-3 cursor-pointer" onClick={toggleDrawer} />
            
            <OffcanvasHeader className="border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <img src={image} className="h-12 w-12 rounded object-cover" alt="thumbnail" loading='lazy' />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-white truncate">{title}</span>
                  <span className="text-xs text-gray-400 truncate">{channelName}</span>
                </div>
              </div>
            </OffcanvasHeader>
            
            <OffcanvasBody className="flex flex-col gap-1 pt-2 pb-6">
              {menuOptions.map((option) => (
                <div 
                  key={option.label}
                  className='flex items-center gap-3 text-gray-300 cursor-pointer hover:text-white transition-colors p-2 -mx-2 rounded-lg hover:bg-zinc-800 mt-2'
                  onClick={() => handleMenuAction(option.action, option.toast)}
                >
                  {option.icon} {option.label}
                </div>
              ))}
            </OffcanvasBody>
          </Offcanvas>
        </div>
      ) : null}
    </div>
  );
};

export default SongCard;