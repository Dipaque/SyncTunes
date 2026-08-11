import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMusicData } from "../../hooks/useMusicData";
import SongCard from "../../Components/SongCard";
import {
  IoArrowBack,
  IoPause,
  IoPlay,
  IoShuffleOutline,
} from "react-icons/io5";
import { useStateContext } from "../../Context/ContextProvider";
import Cookies from "js-cookie";
import { formatText } from "../../utils/formatText";
import AlbumShimmer from "../../Components/loading/AlbumShimmer";
import GenericNotFound from "../../Components/NotFoundPage";
import bulkQueue from "../../Functions/bulkQueue";
// 🐛 IMPORT THE SHUFFLE UTILITY
import shuffle from "../../Functions/shuffle";
import { getRoutes, localStorage_pinSongs, PLAYER_MODE } from "../../constants";
import { getPath } from "../../utils/getPath";
import LikeEntity from "../../Components/likes/LikeEntity";
import { VscPinned } from "react-icons/vsc";
import handlePin from "../../Functions/handlePin";
import { BsPinFill } from "react-icons/bs";

const AlbumView = () => {
  // Extracting 'id' (roomId) and 'album' (albumId) from the route params
  const { id: roomCode, album: albumId } = useParams();

  // Fetch album data using the albumId
  const { data: album, isLoading } = useMusicData("album", albumId);

  const nav = useNavigate();

  // Bring in context for the queue function
  const {
    videoIds,
    currentPlaying,
    isPause,
    playerMode,
    setVideoIds,
    setSongsList,
  } = useStateContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPinned, setIsPinned] = useState(false)

  const isSolo = playerMode === PLAYER_MODE.SOLO;
  const ROUTE = getRoutes(isSolo);


  useEffect(() => {
    if (currentPlaying?.id) {
      // search the current song present in the playlist
      const song = album?.songs?.find(
        (song) => song?.videoId === currentPlaying?.id
      );

      // if present update the state
      if (song) {
        setIsPlaying(true);
      }
    }
    const pinnedSongsLookup = JSON.parse(localStorage.getItem(localStorage_pinSongs)) || {};
    const isPinned = album ? !!pinnedSongsLookup[albumId] : false;

    setIsPinned(isPinned); // Update the ui
  }, [album, currentPlaying]);

  if (isLoading) {
    return <AlbumShimmer />;
  }

  if (!album || !album?.songs) return <GenericNotFound />;

  const coverImage = album.thumbnails?.[album.thumbnails.length - 1]?.url;

  // Function to loop and queue all songs (In Order)
  const handlePlayAll = async () => {
    // Prepare songs payload
    const newSongs = album?.songs?.map((song) => {
      const image =
        song.thumbnails?.[song?.thumbnails.length - 1]?.url || coverImage;
      const channelName =
        song.artists?.map((a) => a.name).join(", ") || song?.artist?.name;

      return {
        image,
        channelName,
        id: song?.videoId,
        title: song?.name,
        artistId: song?.artist?.artistId,
        playedBy: Cookies.get("name"),
      };
    });

    // update to the playlist
    await bulkQueue({
      newSongs,
      queuedSongs: videoIds,
      playerMode,
      setVideoIds,
      setSongsList,
    });

    nav(getPath(ROUTE.PLAYER, roomCode));
  };

  // 🐛 NEW: Function to shuffle all songs into the queue
  const handleShuffleAlbum = async () => {
    if (!album?.songs) return;

    const newSongs = album.songs.map((song) => {
      const image =
        song.thumbnails?.[song?.thumbnails.length - 1]?.url || coverImage;
      const channelName =
        song.artists?.map((a) => a.name).join(", ") || song?.artist?.name;

      return {
        image,
        channelName,
        id: song?.videoId,
        title: song?.name,
        artistId: song?.artist?.artistId,
        playedBy: Cookies.get("name") || "Solo Player",
      };
    });

    // Use our upgraded bulk shuffle utility
    await shuffle({
      newSongs,
      queuedSongs: videoIds,
      playerMode,
      setVideoIds,
      setSongsList,
    });

    nav(getPath(ROUTE.PLAYER, roomCode));
  };

  const pinAlbum = () => {
    const metaData = {
      id: albumId,
      title: album?.title || album?.name,
      image: coverImage,
      channelName: album?.name || album?.artist?.name,
      artistId: album.artist.artistId,
      itemType: "ALBUM",
    };

    // pass the data to pin function
    handlePin({song: metaData, onDelete:() => setIsPinned(false), onInsert:() => setIsPinned(true)});
  }

  return (
    <div className="bg-black min-h-screen text-white pb-28 pt-8 px-3 overflow-y-auto">
      {/* Back Button */}
      <IoArrowBack
        size={26}
        className="cursor-pointer mb-2 hover:text-gray-300"
        onClick={() => nav(-1)}
      />

      {/* Hero Section */}
      <div className="flex flex-col items-center mb-2">
        <img
          src={coverImage}
          alt={album.title}
          className="w-56 h-56 object-cover rounded-md shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-6"
          loading="lazy"
        />

        <h4 className="font-semibold">{album?.name}</h4>

        {/* Text Container */}
        <div className="w-full max-w-md flex flex-col items-start text-left px-2">
          <h1 className="text-2xl font-bold mb-1">{album.title}</h1>

          <div className="flex flex-row items-center justify-between w-full">
            <p className="text-gray-400 text-xs m-0 flex flex-col items-start gap-2">
              <Link
                to={
                  album?.artist?.artistId
                    ? getPath(ROUTE.ARTIST, roomCode).replace(
                        ":artist",
                        album.artist.artistId
                      )
                    : "#"
                }
                className="font-semibold text-start text-white list-none no-underline gap-2 hover:underline"
              >
                {album?.artist?.name || "Artist name"}
              </Link>
              <span>
                {formatText(album?.type) || "Album"} • {album.year || "Unknown"}{" "}
                • {album.songs?.length} tracks
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons (Like + Shuffle + Play) */}
      <div className="flex items-center justify-between gap-3 px-2 mb-4">
        <div className="flex items-center gap-3">
          {/* 🐛 NEW: Shuffle Button triggers handleShuffleAlbum */}
          <IoShuffleOutline
            size={32}
            className="cursor-pointer text-white hover:text-[#1ed760] transition-colors"
            onClick={handleShuffleAlbum}
          />
          <div onClick={pinAlbum}>
          {
            isPinned ? <BsPinFill size={27} /> : <VscPinned
            size={32}
          />
          } 
          </div>
          <div className="-ms-2">
          <LikeEntity id={albumId} type="album" iconSize={32}  />
          </div>
        </div>

        <button
          onClick={handlePlayAll}
          className="bg-white text-black p-3 rounded-full hover:scale-105 transition-transform flex items-center justify-center shadow-xl"
        >
          {isPlaying && !isPause ? (
            <IoPause size={28} />
          ) : (
            <IoPlay size={28} className="ml-1" />
          )}
        </button>
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
            channelName={
              song.artists?.map((a) => a.name).join(", ") || song?.artist?.name
            }
            artistId={song?.artist?.artistId}
          />
        ))}
      </div>
    </div>
  );
};

export default AlbumView;
