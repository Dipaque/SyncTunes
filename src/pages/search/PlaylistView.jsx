import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMusicData } from '../../hooks/useMusicData';
import Shimmer from '../../Components/Shimmer';
import SongCard from '../../Components/SongCard';
import { IoArrowBack, IoPlay } from 'react-icons/io5';
import { useStateContext } from '../../Context/ContextProvider';
import Cookies from 'js-cookie';
import addToQueue from '../../Functions/addToQueue';
import Toast from '../../Components/Toast';
import { formatText } from '../../utils/formatText';
import GenericNotFound from '../../Components/NotFoundPage';

const PlaylistView = () => {
  // Extracting 'id' (roomId) and 'album' (albumId) from the route params
  const { id: roomCode, playlist: playlistId } = useParams(); 
  
  // Fetch album data using the albumId
  const { data: album, isLoading } = useMusicData('playlist', playlistId);

  const nav = useNavigate();

  const [toastMsg, setToastMsg] = useState("");
  const [toastDisplay, setToastDisplay] = useState(false);
  
  // Bring in context for the queue function
  const { videoIds } = useStateContext();

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen pt-5 px-4 flex flex-col gap-4">
        <div className="w-48 h-48 bg-zinc-800 animate-pulse rounded-lg mx-auto"></div>
        {Array(10).fill(0).map((_, i) => <Shimmer key={i} />)}
      </div>
    );
  }

  if (!album || !album?.songs) return <GenericNotFound />;

  const coverImage = album.thumbnails?.[album.thumbnails.length - 1]?.url;

  // Function to loop and queue all songs
  const handlePlayAll = async () => {
    setToastDisplay(true);
    setToastMsg('Adding tracks to queue...');
    setTimeout(() => setToastDisplay(false), 4000);

    // Basic loop for now (Optimization to handle Firebase batching will be done later)
    for (const song of album.songs || []) {
      const songImage = song.thumbnails?.[song?.thumbnails.length - 1]?.url || coverImage;
      const artistName = song.artists?.map(a => a.name).join(', ') || song?.artist?.name;
      
      await addToQueue(
        songImage, 
        song.name, 
        song.videoId, 
        artistName, 
        videoIds, 
        Cookies.get('name'),
        song?.artist?.artistId
      );
    }

    nav(`/room/${encodeURI(roomCode)}/player`);
  };

  return (
    <div className="bg-black min-h-screen text-white pb-28 pt-8 px-3 overflow-y-auto">
          {/* Back Button */}
      <IoArrowBack 
        size={26} 
        className="cursor-pointer mb-4 hover:text-gray-300" 
        onClick={() => nav(-1)} 
      />

      {/* Hero Section */}
      <div className="flex flex-col items-center mb-8">
        <img 
          src={coverImage} 
          alt={album.title} 
          className="w-56 h-56 object-cover rounded-md shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-6" 
        />

        <h4 className='font-semibold'>{album?.name}</h4>
        
        
        {/* Text & Button Container */}
        <div className="w-full max-w-md flex flex-col items-start text-left px-2">
          <h1 className="text-2xl font-bold mb-2">{album.title}</h1>
          
          <div className="flex flex-row items-center justify-between w-full">
            <p className="text-gray-400 text-xs m-0 flex flex-col items-start gap-2">
            <a href={`/room/${encodeURI(roomCode)}/artists/${album?.artist?.artistId}`} className='font-semibold text-start text-white list-none no-underline gap-2'>{album?.artist?.name || "Artist name"}</a>
               {formatText(album?.type) || 'Album'} • {album.year || 'Unknown'} • {album.songs?.length} tracks
            </p>
            
            <button 
              onClick={handlePlayAll}
              className="bg-white text-black p-2 rounded-full hover:scale-105 transition-transform flex items-center justify-center"
            >
              <IoPlay size={28} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <div className="flex flex-col gap-1">
        {album.songs?.map((song) => (
          <SongCard
            key={song.videoId}
            id={song.videoId}
            type="SONG"
            title={song.name}
            image={song.thumbnails?.[3]?.url || coverImage}
            channelName={song.artists?.map(a => a.name).join(', ') || song?.artist?.name}
            artistId={song?.artist?.artistId}
            setToastDisplay={setToastDisplay}
            setToastMsg={setToastMsg}
          />
        ))}
      </div>

      {toastDisplay && (
        <div className="flex justify-center">
          <Toast message={toastMsg} showToast={toastDisplay} />
        </div>
      )}
    </div>
  );
};

export default PlaylistView;