import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import apiClient from '../utils/apiClient';
import SongCard from '../Components/SongCard'; 
import { useNavigate } from 'react-router-dom';
import { library_route, getRoutes, PLAYER_MODE, DB_NAME, LIBRBARY_CACHE_STORE_NAME } from '../constants';
import RoomTemplate from '../Components/RoomTemplate';
import Spinner from '../Components/loading/Spinner';
import GenericNotFound from '../Components/NotFoundPage';
import { HiOutlineSearch } from 'react-icons/hi'; 
import { IoPlay, IoPause, IoShuffleOutline } from 'react-icons/io5';
import { useStateContext } from '../Context/ContextProvider';
import bulkQueue from '../Functions/bulkQueue';
import shuffle from '../Functions/shuffle';
import { getPath } from '../utils/getPath';
import { appCache } from '../utils/cache';

const Library = () => {
  const [activeTab, setActiveTab] = useState('songs');
  const [searchQuery, setSearchQuery] = useState(''); 
  const [libraryData, setLibraryData] = useState({
    likedSongs: [],
    likedArtists: [],
    likedAlbums: [],
    likedPlaylists: []
  });
  const [myRooms, setMyRooms] = useState([]);
  
  // Start loading by default
  const [isLoading, setIsLoading] = useState(true);

  
  const nav = useNavigate();
  const userId = Cookies.get('uid');
  const email = Cookies.get('email');
  
  const { videoIds, setVideoIds, currentPlaying, isPause, setIsPause, playerMode, setSongsList } = useStateContext();
  const isSolo = playerMode === PLAYER_MODE.SOLO;
  const ROUTE = getRoutes(isSolo);
  const roomCode = sessionStorage.getItem("roomCode") || "";

  useEffect(() => {
    const fetchLibraryAndRooms = async () => {
      if (!userId || !email) return;

      const libCacheKey = `library_data_${userId}`;
      const roomsCacheKey = `rooms_data_${email}`;

      // 1. FAST LOAD: Check IndexedDB Cache first
      const cachedLibrary = await appCache.get(libCacheKey);
      const cachedRooms = await appCache.get(roomsCacheKey);

      if (cachedLibrary) {
        setLibraryData(cachedLibrary);
        setIsLoading(false); // Hide spinner instantly if we have cached data
      }
      if (cachedRooms) {
        setMyRooms(cachedRooms);
      }

      // 2. BACKGROUND FETCH: Get fresh data from the API silently
      try {
        const [libRes, roomsRes] = await Promise.all([
          apiClient.post(`${library_route}/all`, { userId }),
          apiClient.post(`${library_route}/my-rooms`, { email })
        ]);

        const freshLibrary = libRes.data;
        const freshRooms = roomsRes.data;

        // 3. SILENT UPDATE: Update React State (UI will seamlessly update if anything changed)
        setLibraryData(freshLibrary);
        setMyRooms(freshRooms);
        setIsLoading(false); // Failsafe if cache was empty

        // 4. CACHE UPDATE: Save fresh data to IndexedDB for next time
        await appCache.set(libCacheKey, freshLibrary);
        await appCache.set(roomsCacheKey, freshRooms);

      } catch (error) {
        console.error("Failed to fetch fresh library data:", error);
        setIsLoading(false);
      }
    };

    fetchLibraryAndRooms();
  }, [userId, email]);

  const tabs = [
    { id: 'songs', label: 'Liked Songs' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums & Playlists' },
    { id: 'rooms', label: 'My Rooms' }
  ];

  const queryLower = searchQuery.toLowerCase();

  const filteredSongs = libraryData.likedSongs.filter(song => 
    song.title?.toLowerCase().includes(queryLower) || 
    song.channelName?.toLowerCase().includes(queryLower)
  );

  const filteredArtists = libraryData.likedArtists.filter(artist => 
    artist.title?.toLowerCase().includes(queryLower)
  );

  const filteredAlbums = [...libraryData.likedAlbums, ...libraryData.likedPlaylists].filter(item => 
    item.title?.toLowerCase().includes(queryLower) || 
    item.channelName?.toLowerCase().includes(queryLower)
  );

  const filteredRooms = myRooms.filter(room => 
    room.roomName?.toLowerCase().includes(queryLower) || 
    room.roomId?.toLowerCase().includes(queryLower)
  );

  const getActiveTabCountInfo = () => {
    switch (activeTab) {
      case 'songs': return `${filteredSongs.length} Song${filteredSongs.length !== 1 ? 's' : ''}`;
      case 'artists': return `${filteredArtists.length} Artist${filteredArtists.length !== 1 ? 's' : ''}`;
      case 'albums': return `${filteredAlbums.length} Album${filteredAlbums.length !== 1 ? 's' : ''} & Playlist${filteredAlbums.length !== 1 ? 's' : ''}`;
      case 'rooms': return `${filteredRooms.length} Room${filteredRooms.length !== 1 ? 's' : ''}`;
      default: return '';
    }
  };

  const isPlayingLikedSongs = filteredSongs.some(song => song.id === currentPlaying?.id);

  const togglePlayPause = async () => {
    if (isPlayingLikedSongs && !isPause) {
      setIsPause(true); 
      return;
    }
    if (isPlayingLikedSongs && isPause) {
      setIsPause(false); 
      return;
    }

    const newSongs = filteredSongs.map((song) => ({
      image: song.image,
      channelName: song.channelName,
      id: song.id,
      title: song.title,
      artistId: song.artistId,
      playedBy: Cookies.get("name") || "Solo Player",
    }));

    await bulkQueue({
      newSongs,
      queuedSongs: videoIds,
      playerMode,
      setVideoIds,
      setSongsList 
    });

    nav(getPath(ROUTE.PLAYER, roomCode));
  };

  const handleShuffleLikedSongs = async () => {
    if (!filteredSongs.length) return;

    const newSongs = filteredSongs.map((song) => ({
      image: song.image,
      channelName: song.channelName,
      id: song.id,
      title: song.title,
      artistId: song.artistId,
      playedBy: Cookies.get("name") || "Solo Player",
    }));

    await shuffle({
      newSongs,
      queuedSongs: videoIds,
      playerMode,
      setVideoIds,
      setSongsList
    });

    nav(getPath(ROUTE.PLAYER, roomCode));
  };

  if (isLoading) return <div className="text-white text-center flex items-center justify-center h-screen"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-xl font-bold">Your Library</h1>
        
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiOutlineSearch className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            placeholder={`Search in ${tabs.find(t => t.id === activeTab)?.label}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 text-white text-sm rounded-lg focus:ring-zinc-700 focus:border-zinc-700 block pl-10 p-2.5 outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex overflow-x-auto gap-3 mb-4 no-scrollbar pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery(''); 
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-white text-black' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 pb-28">
        
        {/* SONGS TAB */}
        {activeTab === 'songs' && (
          filteredSongs.length > 0 ? (
            <>
              <div className="flex items-center justify-between gap-4 mb-4 px-1">
                <div className="text-sm flex flex-col items-start gap-2 font-medium text-gray-400 px-1">
                  <span className="text-lg text-white">Liked Songs</span>
                  {getActiveTabCountInfo()}
                </div>
                <div className='flex items-center gap-4'>
                  <IoShuffleOutline 
                    size={32} 
                    className="cursor-pointer text-white hover:text-[#1ed760] transition-colors" 
                    onClick={handleShuffleLikedSongs}
                  />
                  <button
                    onClick={togglePlayPause}
                    className="bg-white text-black p-2 rounded-full hover:scale-105 transition-transform flex items-center justify-center shadow-xl"
                  >
                    {isPlayingLikedSongs && !isPause ? (
                      <IoPause size={28} />
                    ) : (
                      <IoPlay size={28} className="ml-1" />
                    )}
                  </button>
                </div>
              </div>

              {filteredSongs.map(song => (
                <SongCard key={song.id} {...song} type="SONG" />
              ))}
            </>
          ) : <GenericNotFound content={searchQuery ? "No matching songs found." : "You haven't liked any songs yet."} />
        )}

        {/* ARTISTS TAB */}
        {activeTab === 'artists' && (
          filteredArtists.length > 0 ? (
            filteredArtists.map(artist => (
              <SongCard key={artist.id} {...artist} type="ARTIST" />
            ))
          ) : <GenericNotFound content={searchQuery ? "No matching artists found." : "No saved artist yet."} />
        )}

        {/* ALBUMS & PLAYLISTS TAB */}
        {activeTab === 'albums' && (
          filteredAlbums.length > 0 ? (
            filteredAlbums.map(item => (
              <SongCard key={item.id} {...item} type={item.type} />
            ))
          ) : <GenericNotFound content={searchQuery ? "No matching albums found." : "No saved albums yet."} />
        )}

        {/* MY ROOMS TAB */}
        {activeTab === 'rooms' && (
          filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRooms.map(room => (
                <RoomTemplate data={room} key={room.roomId} />
              ))}
            </div>
          ) : <GenericNotFound content={searchQuery ? "No matching rooms found." : "You haven't created any room yet."} />
        )}

      </div>
    </div>
  );
};

export default Library;