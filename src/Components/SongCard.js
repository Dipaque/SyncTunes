import React, { useState } from 'react';
import { useStateContext } from '../Context/ContextProvider';
import { db } from '../firebase-config';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { HiOutlineQueueList } from "react-icons/hi2";
import { IoEllipsisVertical, IoRepeatOutline, IoShuffleOutline, IoPlaySkipForwardOutline } from 'react-icons/io5';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import addToQueue from '../Functions/addToQueue';
import shuffule from '../Functions/shuffle';
import playNext from '../Functions/playNext';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { formatText } from '../utils/formatText';
import { localStorage_recentSearches } from '../constants';

const SongCard = ({ image, title, id, channelName, type, setToastDisplay, setToastMsg, isRecentRequired=false, artistId="" }) => {
  // room id from params
  const { id: paramsId } = useParams();
  const nav = useNavigate();

  // room code
  const roomCode = paramsId || sessionStorage.getItem("roomCode");

  // local state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const { videoIds, currentPlaying, isPause, setIsPause } = useStateContext();

  const addRecent = () => {

    if(!isRecentRequired) return

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
  // 🐛 FIX: Separate ALBUM and PLAYLIST so they match your App.jsx routes exactly
  else if (type === 'ALBUM') {
    nav(`/room/${encodeURI(roomCode)}/albums/${id}`);
  } 
  else if (type === 'PLAYLIST'){
    nav(`/room/${encodeURI(roomCode)}/playlists/${id}`);
  }
  else{
      try {
        const selectedSong = {
          title, id, image, channelName,artistId, playedBy: Cookies.get('name'), playedAt: Timestamp.now()
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
    }
    // record recent
    addRecent();
  };

  // Adjust thumbnail shape based on the type
  const imageStyles = type === 'ARTIST' 
    ? 'rounded-full h-14 w-14 object-cover' 
    : 'rounded-lg h-12 w-16 object-cover';

  return (
    <div className='flex flex-row p-2 px-1 pe-1 justify-center items-center gap-2 text-white cursor-pointer'>
      <img src={image} className={imageStyles} onClick={() => handlePlay()} alt={title} />
      
      <div className='w-2/3 flex flex-col justify-center' onClick={() => handlePlay()}>
      <span className="flex items-start gap-2">
      {currentPlaying.id === id && !isPause ? (
                  <div class="sound-bars">
                    <div class="bar bar1"></div>
                    <div class="bar bar2"></div>
                    <div class="bar bar3"></div>
                  </div>
                ) : (
                  currentPlaying.id === id &&
                  isPause && <div className="text-slate-200 text-lg">...</div>
                )}
        <p className='line-clamp-1 text-sm m-0'>{title}</p>
        </span>
        {type ? <p className='line-clamp-1 text-xs text-gray-400 m-0'>{formatText(type)} &middot; {channelName}</p>: <p className='line-clamp-1 text-xs text-gray-400 m-0'>{channelName}</p>}
      </div>

      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={'down'}>
        <DropdownToggle className='btn' tag={'button'}>
          <IoEllipsisVertical color='white' size={18} />
        </DropdownToggle>
        
        <DropdownMenu className='bg-dark dropdown-menu-end border-dark !hover:bg-zinc-800 !hover:text-slate-200 shadow-lg p-2'>
          <DropdownItem className='d-flex gap-2 pt-3 pb-3 text-light text-xs dropwdown-item' onClick={() => {
            playNext(image, title, id, channelName, videoIds, currentPlaying, Cookies.get('name'), artistId);
            setToastDisplay(true);
            addRecent()
            setToastMsg('Added to Play next');
            setTimeout(() => setToastDisplay(false), 4000);
          }}>
            <IoPlaySkipForwardOutline color='white' size={16} /> Play Next
          </DropdownItem>
          
          <DropdownItem className='d-flex gap-2 pt-3 pb-3 text-light text-xs dropwdown-item' onClick={() => {
            addToQueue(image, title, id, channelName, videoIds, Cookies.get('name'), artistId);
            setToastDisplay(true);
            addRecent()
            setToastMsg('Added to Queue');
            setTimeout(() => setToastDisplay(false), 4000);
          }}>
            <HiOutlineQueueList color='white' size={16} /> Add to Queue
          </DropdownItem>
          
          <DropdownItem className='d-flex gap-2 pt-3 pb-3 text-light text-xs dropwdown-item' onClick={() => {
            addToQueue(image, title, id, channelName, videoIds, Cookies.get('name'), artistId);
            setToastDisplay(true);
            addRecent()
            setToastMsg('Added to Repeat');
            setTimeout(() => setToastDisplay(false), 4000);
          }}>
            <IoRepeatOutline color='white' size={16} /> Repeat
          </DropdownItem>
          
          <DropdownItem className='d-flex gap-2 pt-3 pb-3 text-light text-xs dropwdown-item' onClick={() => {
            shuffule(image, title, id, channelName, videoIds, Cookies.get('name'), artistId);
            setToastDisplay(true);
            addRecent()
            setToastMsg('Added to Shuffle');
            setTimeout(() => setToastDisplay(false), 4000);
          }}>
            <IoShuffleOutline color='white' size={16} /> Shuffle
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default SongCard;