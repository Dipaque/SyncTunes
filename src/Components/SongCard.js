import React, { useState } from 'react';
import { useStateContext } from '../Context/ContextProvider';
import { db } from '../firebase-config';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { HiOutlineQueueList } from "react-icons/hi2";
import { IoEllipsisVertical, IoRepeatOutline, IoShuffleOutline, IoPlaySkipForwardOutline } from 'react-icons/io5';
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'; // 🐛 FIX: Imported Offcanvas components
import addToQueue from '../Functions/addToQueue';
import shuffule from '../Functions/shuffle';
import playNext from '../Functions/playNext';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { formatText } from '../utils/formatText';
import { fontFamily, localStorage_recentSearches } from '../constants';

const SongCard = ({ image, title, id, channelName, type, setToastDisplay, setToastMsg, isRecentRequired=false, artistId="" }) => {
  // room id from params
  const { id: paramsId } = useParams();
  const nav = useNavigate();

  // room code
  const roomCode = paramsId || sessionStorage.getItem("roomCode");

  // local state for Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen((prevState) => !prevState);
  
  const { videoIds, currentPlaying, isPause, setIsPause, searchResult, setSearchResult } = useStateContext();

  // Check if item is a song (default to true if type is omitted)
  const isSong = !type || type === 'SONG';

  const addRecent = () => {
    if (!isRecentRequired) return;

    const recents = JSON.parse(
      localStorage.getItem(localStorage_recentSearches)
    ) || [];
  
    const newRecent = {
      image,
      title,
      id,
      artist: channelName,
      artistId,
      type,
    };
  
    const updatedRecents = [
      newRecent,
      ...recents.filter((item) => item.id !== id),
    ];
  
    localStorage.setItem(
      localStorage_recentSearches,
      JSON.stringify(updatedRecents)
    );
  };

  const handlePlay = async () => {
    // Prevent trying to play Artists directly without routing to an artist page first
    if (type === 'ARTIST') {
      nav(`/room/${encodeURI(roomCode)}/artists/${id}`);
    } 
    else if (type === 'ALBUM') {
      nav(`/room/${encodeURI(roomCode)}/albums/${id}`);
    } 
    else if (type === 'PLAYLIST'){
      nav(`/room/${encodeURI(roomCode)}/playlists/${id}`);
    }
    else {
      try {
        const selectedSong = {
          title, id, image, channelName, artistId, playedBy: Cookies.get('name'), playedAt: Timestamp.now()
        };
  
        if (videoIds?.length > 0) {
          await updateDoc(doc(db, 'room', roomCode), { 
            currentSong: [...videoIds, selectedSong], 
            currentPlaying: selectedSong 
          }).catch(err => console.log(err));
        } else {
          await updateDoc(doc(db, 'room', roomCode), { 
            currentSong: [selectedSong], 
            currentPlaying: selectedSong 
          }).catch(err => console.log(err));
        }
        setIsPause(false);
        nav(`/room/${encodeURI(roomCode)}/player`);
      } catch (err) {
        if (!roomCode) {
          setToastDisplay(true);
          setToastMsg('Join Room to play Songs');
          setTimeout(() => setToastDisplay(false), 4000);
        }
        console.log(err);
      }

      // clear search result only if song played
      if (searchResult?.length > 0) {
        setSearchResult([]);
      }
    }
    // record recent
    addRecent();
  };

  /**
   * Handles drawer actions and closes it automatically
   */
  const handleMenuAction = (actionCallback, toastMessage) => {
    actionCallback();
    setToastDisplay && setToastDisplay(true);
    addRecent();
    // clear search result only if song played
    if (searchResult?.length > 0) {
      setSearchResult([]);
    }
    setToastMsg && setToastMsg(toastMessage);
    setToastDisplay && setTimeout(() => setToastDisplay(false), 4000);
    setDrawerOpen(false); // 🐛 FIX: Close drawer after clicking an action
  };

  // Adjust thumbnail shape based on the type
  const imageStyles = type === 'ARTIST' 
    ? 'rounded-full h-12 w-12 object-cover shrink-0' 
    : 'rounded-lg h-12 w-16 object-cover shrink-0';

  return (
    <div className='flex flex-row p-2 px-1 pe-1 items-center gap-3 text-white cursor-pointer w-full hover:bg-zinc-900/40 rounded-lg transition-colors'>
      {/* Thumbnail */}
      <img src={image} className={imageStyles} onClick={() => handlePlay()} alt={title} />
      
      {/* Song Title & Channel Info */}
      <div className='flex-1 min-w-0 flex flex-col justify-center' onClick={() => handlePlay()}>
        <div className="flex items-center gap-2 min-w-0">
          {currentPlaying.id === id && !isPause ? (
            <div className="sound-bars shrink-0">
              <div className="bar bar1"></div>
              <div className="bar bar2"></div>
              <div className="bar bar3"></div>
            </div>
          ) : (
            currentPlaying.id === id && isPause && (
              <div className="text-slate-200 text-sm font-bold shrink-0">...</div>
            )
          )}
          <p className='truncate text-sm font-medium m-0 text-white'>{title}</p>
        </div>

        <p className='truncate text-xs text-gray-400 m-0 mt-0.5'>
          {type ? `${formatText(type)} · ${channelName}` : channelName}
        </p>
      </div>

      {/* Drawer Menu Trigger (Rendered ONLY if item is a SONG) */}
      {isSong && (
        <div className='shrink-0'>
          <button 
            className='btn border-0 shadow-none focus:outline-none p-1' 
            onClick={toggleDrawer}
          >
            <IoEllipsisVertical color='white' size={18} />
          </button>

          {/* Bottom Drawer (Offcanvas) */}
          <Offcanvas 
            isOpen={drawerOpen} 
            toggle={toggleDrawer} 
            unmountOnClose={true}
            style={{
              fontFamily: fontFamily,
              borderTopLeftRadius: "14px",
              borderTopRightRadius: "14px",
            }}
            direction="bottom"
            className="!bg-zinc-900 !text-slate-200 !h-auto !max-w-screen-sm !rounded-t-2xl !mx-auto"
          >
            {/* Handle bar for aesthetic purposes */}
            <div className="border-1 border-zinc-600 p-[2px] bg-zinc-600 w-10 rounded-full mx-auto mt-3" onClick={toggleDrawer} />
            
            <OffcanvasHeader className="border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <img src={image} className="h-12 w-12 rounded object-cover" alt="thumbnail" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-white truncate">{title}</span>
                  <span className="text-xs text-gray-400 truncate">{channelName}</span>
                </div>
              </div>
            </OffcanvasHeader>
            
            <OffcanvasBody className="flex flex-col gap-1 pt-2 pb-6">
              
              <div 
                className='flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors text-sm'
                onClick={() => handleMenuAction(
                  () => playNext(image, title, id, channelName, videoIds, currentPlaying, Cookies.get('name'), artistId),
                  'Added to Play next'
                )}
              >
                <IoPlaySkipForwardOutline color='white' size={20} /> Play Next
              </div>
              
              <div 
                className='flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors text-sm'
                onClick={() => handleMenuAction(
                  () => addToQueue(image, title, id, channelName, videoIds, Cookies.get('name'), artistId),
                  'Added to Queue'
                )}
              >
                <HiOutlineQueueList color='white' size={20} /> Add to Queue
              </div>
              
              <div 
                className='flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors text-sm'
                onClick={() => handleMenuAction(
                  () => addToQueue(image, title, id, channelName, videoIds, Cookies.get('name'), artistId),
                  'Added to Repeat'
                )}
              >
                <IoRepeatOutline color='white' size={20} /> Repeat
              </div>
              
              <div 
                className='flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors text-sm'
                onClick={() => handleMenuAction(
                  () => shuffule(image, title, id, channelName, videoIds, Cookies.get('name'), artistId),
                  'Added to Shuffle'
                )}
              >
                <IoShuffleOutline color='white' size={20} /> Shuffle
              </div>

            </OffcanvasBody>
          </Offcanvas>
        </div>
      )}
    </div>
  );
};

export default SongCard;