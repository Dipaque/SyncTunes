import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
const StateContext = createContext();
export const ContextProvider = ({ children }) => {
  const [videoId, setVideoId] = useState("");
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [modal_backdrop1, setmodal_backdrop1] = useState(false);
  const [joineeSong, setJoineeSong] = useState("");
  const [pathName, setPathName] = useState("");
  const [videoIds, setVideoIds] = useState([]);
  const [notification, setNotification] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isLeaving, setIsLeaving] = useState(false);
  const [onReady, setOnReady] = useState();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [currentPlaying, setCurrentPlaying] = useState("");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [playedBy, setPlayedBy] = useState("");
  const seekBarRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnail, setThumbnail] = useState("");
  const [isPause, setIsPause] = useState(false);
  const [songsList,setSongsList] = useState([])
  const [roomMate, setRoomMate] = useState([]);
  const [admin, setAdmin] = useState({
    email: "",
    userName: "",
  });

  const handleClear = useCallback(() => {
    setCurrentPlaying("")
    setThumbnail("")
    setArtist("")
    setTitle("")
    setPlayedBy("")
    setCurrentTime(0)
    setDuration(0);
    setMessages([])
    seekBarRef.current = null
  }, []);

  return (
    <StateContext.Provider
      value={{
        videoId,
        setVideoId,
        modal_backdrop,
        setmodal_backdrop,
        modal_backdrop1,
        setmodal_backdrop1,
        joineeSong,
        setJoineeSong,
        pathName,
        setPathName,
        notification,
        setNotification,
        videoIds,
        setVideoIds,
        messages,
        setMessages,
        isLeaving,
        setIsLeaving,
        setOnReady,
        onReady,
        title,
        setTitle,
        artist,
        setArtist,
        currentPlaying,
        setCurrentPlaying,
        duration,
        setDuration,
        currentTime,
        setCurrentTime,
        isSeeking,
        setIsSeeking,
        seekBarRef,
        playedBy,
        setPlayedBy,
        isLoading,
        setIsLoading,
        thumbnail,
        setThumbnail,
        isPause,
        setIsPause,
        handleClear,
        songsList,
        setSongsList,
        roomMate, 
        setRoomMate,
        admin, 
        setAdmin
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
export const useStateContext = () => useContext(StateContext);
