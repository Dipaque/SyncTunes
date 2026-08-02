import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMusicData } from '../../hooks/useMusicData';
import SongCard from '../../Components/SongCard';
import { IoArrowBack, IoPause, IoPlay } from 'react-icons/io5';
import { useStateContext } from '../../Context/ContextProvider';
import Cookies from 'js-cookie';
import addToQueue from '../../Functions/addToQueue';
import ArtistShimmer from '../../Components/loading/ArtistShimmer';

const ArtistView = () => {
  // Extracting 'id' (roomId) and 'artist' (artistId) from the route params
  const { id: roomId, artist: artistId } = useParams();
  const navigate = useNavigate();
  
  // Context for queueing
  const { videoIds, currentPlaying, isPause } = useStateContext();
  
  // Fetch artist data using the artistId
  const { data: artist, isLoading } = useMusicData('artist', artistId);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(()=>{
    if(currentPlaying?.id){
      // search the current song present in the playlist 
      const song = artist?.topSongs?.find((song)=>song?.videoId===currentPlaying?.id);
      
      // if present update the state
      if(song){
        setIsPlaying(true)
      }
    }
  },[artist?.topSongs, currentPlaying])

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen pt-10 px-4">
        {/* <div className="w-full h-64 bg-zinc-900 animate-pulse mb-4"></div> */}
        <ArtistShimmer />
      </div>
    );
  }

  if (!artist) return <div className="text-white bg-black h-screen p-5">Artist not found.</div>;

  const artistImage = artist.thumbnails?.[artist.thumbnails.length - 1]?.url;

  // Function to queue top songs
  const handlePlayTopSongs = async () => {

    for (const song of artist.topSongs || []) {
      const songImage = song.thumbnails?.[song.thumbnails.length - 1]?.url;
      await addToQueue(
        songImage, 
        song.name, 
        song.videoId, 
        artist.name, 
        videoIds, 
        Cookies.get('name')
      );
    }
  };

  return (
    // Removed px-4 here so the hero image can bleed to the edges
    <div className="bg-black min-h-screen text-white pb-28 overflow-y-auto">
      
      {/* Spotify-style Hero Section */}
      <div className="relative w-full h-80 mb-6">
        {/* Full Cover Image */}
        <img 
          src={artistImage} 
          alt={artist.name} 
          className="w-full h-full object-cover" 
        />
        
        {/* Gradient Fade to Black */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

        {/* Glass Backdrop Back Button */}
        <div 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/10 backdrop-blur-md rounded-full cursor-pointer hover:bg-white/20 transition-all z-10"
        >
          <IoArrowBack size={24} color="white" />
        </div>

        {/* Artist Details & Play Button Overlaid on Image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-1">
              {artist.name}
            </h1>
            <p className="text-gray-300 text-sm font-medium drop-shadow-md">
              {artist.subscribers || 'Artist'}
            </p>
          </div>
          
          {/* Play Button */}
          {artist.topSongs?.length > 0 && (
            <button 
              onClick={handlePlayTopSongs}
              className="bg-white text-black p-3 rounded-full hover:scale-105 transition-transform flex items-center justify-center shadow-xl"
            >
              {isPlaying && !isPause? <IoPause size={28} /> : <IoPlay size={28} className="ml-1" />}
            </button>
          )}
        </div>
      </div>

      {/* Content wrapper with padding */}
      <div className="px-4">
        
        {/* Top Songs */}
        {artist.topSongs?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Popular</h2>
            <div className="flex flex-col gap-1">
              {artist.topSongs.map((song) => (
                <SongCard
                  key={song.videoId}
                  id={song.videoId}
                  type="SONG"
                  title={song.name}
                  image={song.thumbnails?.[song.thumbnails?.length - 1]?.url}
                  channelName={artist.name}
                  artistId={song?.artist?.artistId}

                />
              ))}
            </div>
          </div>
        )}

        {/* Albums (Horizontal Scroll) */}
        {artist.topAlbums?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Latest Releases</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
              {artist.topAlbums.map((album) => (
                <div 
                  key={album.browseId} 
                  className="cursor-pointer group flex-none w-36 snap-start"
                  onClick={() => navigate(`/room/${roomId}/albums/${album.albumId}`)}
                >
                  <img 
                    src={album.thumbnails?.[album.thumbnails.length - 1]?.url} 
                    alt={album.name}
                    className="w-full aspect-square object-cover rounded-md mb-2 group-hover:opacity-80 transition-opacity"
                  />
                  <p className="text-sm font-semibold truncate">{album.name}</p>
                  <p className="text-xs text-gray-400">{album.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Singles / Featuring (Horizontal Scroll) */}
        {artist.topSingles?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Singles & EPs</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
              {artist.topSingles.map((single) => (
                <div 
                  key={single.browseId} 
                  className="cursor-pointer group flex-none w-36 snap-start"
                  onClick={() => navigate(`/room/${roomId}/albums/${single.albumId}`)}
                >
                  <img 
                    src={single.thumbnails?.[single.thumbnails.length - 1]?.url} 
                    alt={single.name}
                    className="w-full aspect-square object-cover rounded-md mb-2 group-hover:opacity-80 transition-opacity"
                  />
                  <p className="text-sm font-semibold truncate">{single.name}</p>
                  <p className="text-xs text-gray-400">{single.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured On (Playlists / Compilations) */}
        {artist.featuredOn?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Featured On</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
              {artist.featuredOn.map((featured) => (
                <div 
                  key={featured.browseId || featured.playlistId} 
                  className="cursor-pointer group flex-none w-36 snap-start"
                  // Using playlists route if ytmusic returns a playlistId, otherwise fallback to albums
                  onClick={() => navigate(`/room/${roomId}/${featured.playlistId ? 'playlists' : 'albums'}/${featured.playlistId || featured.browseId}`)}
                >
                  <img 
                    src={featured.thumbnails?.[featured.thumbnails.length - 1]?.url} 
                    alt={featured.title || featured.name}
                    className="w-full aspect-square object-cover rounded-md mb-2 group-hover:opacity-80 transition-opacity"
                  />
                  <p className="text-sm font-semibold truncate">{featured.title || featured.name}</p>
                  <p className="text-xs text-gray-400">{featured.year || 'Playlist'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fans Also Like / Similar Artists (Horizontal Scroll, Circular) */}
        {artist?.similarArtists?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Fans also like</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
              {artist?.similarArtists?.map((similarArtist) => (
                <div 
                  key={similarArtist.browseId || similarArtist.artistId} 
                  className="cursor-pointer group flex-none w-28 snap-start flex flex-col items-center text-center"
                  onClick={() => navigate(`/room/${roomId}/artists/${similarArtist.artistId || similarArtist.browseId}`)}
                >
                  <img 
                    src={similarArtist.thumbnails?.[similarArtist.thumbnails.length - 1]?.url} 
                    alt={similarArtist.name}
                    className="w-24 h-24 object-cover rounded-full mb-2 group-hover:opacity-80 transition-opacity shadow-md"
                  />
                  <p className="text-sm font-semibold line-clamp-2">{similarArtist.name}</p>
                  {similarArtist.subscribers && (
                    <p className="text-xs text-gray-400 truncate w-full">{similarArtist.subscribers}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ArtistView;