import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import apiClient from '../utils/apiClient';
import SongCard from '../Components/SongCard'; 
import { useNavigate } from 'react-router-dom';
import { library_route } from '../constants';
import RoomTemplate from '../Components/RoomTemplate';
import Spinner from '../Components/loading/Spinner';
import GenericNotFound from '../Components/NotFoundPage';
import { HiOutlineSearch } from 'react-icons/hi'; // Importing a search icon

const Library = () => {
  const [activeTab, setActiveTab] = useState('songs');
  const [searchQuery, setSearchQuery] = useState(''); // 1. New Search State
  const [libraryData, setLibraryData] = useState({
    likedSongs: [],
    likedArtists: [],
    likedAlbums: [],
    likedPlaylists: []
  });
  const [myRooms, setMyRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const nav = useNavigate();
  const userId = Cookies.get('uid');
  const email = Cookies.get('email');

  useEffect(() => {
    const fetchLibraryAndRooms = async () => {
      setIsLoading(true);
      try {
        const libRes = await apiClient.post(`${library_route}/all`, { userId });
        setLibraryData(libRes.data);

        const roomsRes = await apiClient.post(`${library_route}/my-rooms`, { email });
        setMyRooms(roomsRes.data);
      } catch (error) {
        console.error("Failed to fetch library:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && email) fetchLibraryAndRooms();
  }, [userId, email]);

  // Tab Navigation configuration
  const tabs = [
    { id: 'songs', label: 'Liked Songs' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums & Playlists' },
    { id: 'rooms', label: 'My Rooms' }
  ];

  // 2. Filter Logic (Case-insensitive)
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

  // 3. Dynamic Count Helper
  const getActiveTabCountInfo = () => {
    switch (activeTab) {
      case 'songs': return `${filteredSongs.length} Liked Song${filteredSongs.length !== 1 ? 's' : ''}`;
      case 'artists': return `${filteredArtists.length} Artist${filteredArtists.length !== 1 ? 's' : ''}`;
      case 'albums': return `${filteredAlbums.length} Album${filteredAlbums.length !== 1 ? 's' : ''} & Playlist${filteredAlbums.length !== 1 ? 's' : ''}`;
      case 'rooms': return `${filteredRooms.length} Room${filteredRooms.length !== 1 ? 's' : ''}`;
      default: return '';
    }
  };

  if (isLoading) return <div className="text-white text-center flex items-center justify-center h-screen"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-xl font-bold">Your Library</h1>
        
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiOutlineSearch className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            placeholder={`Search in ${tabs.find(t => t.id === activeTab)?.label}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900   text-white text-sm rounded-lg focus:ring-zinc-700 focus:border-zinc-700 block pl-10 p-2.5 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex overflow-x-auto gap-3 mb-4 no-scrollbar pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchQuery(''); // Optional: clear search when switching tabs
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-white text-black' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Count Display */}
      <div className="text-sm font-medium text-gray-400 mb-4 px-1">
        {getActiveTabCountInfo()}
      </div>

      {/* Tab Content */}
      <div className="flex flex-col gap-2 pb-28">
        
        {/* SONGS TAB */}
        {activeTab === 'songs' && (
          filteredSongs.length > 0 ? (
            filteredSongs.map(song => (
              <SongCard key={song.id} {...song} type="SONG" />
            ))
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