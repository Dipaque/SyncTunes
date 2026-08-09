import React,{useCallback, useEffect, useState,} from 'react';
import './App.css';
import './index.css';
import logo from "./assests/sync-tunes-pip.png";
import { Route, Routes,useLocation, useNavigate } from 'react-router-dom';
import YouTubeVideo from "../src/Components/YoutubeVideo"
import Search from './pages/Search';
import Login from './pages/Login';
import Chat from './pages/Chat';
import styled from 'styled-components'; // or import { css } from '@emotion/react';
import { useStateContext } from './Context/ContextProvider';
import Settings from './pages/settings/Settings';
import Profile from './Components/settings/Profile';
import About from './Components/settings/About';
import Rooms from './Components/settings/Rooms';
import Privacypolicy from './pages/settings/Privacypolicy';
import Terms from './pages/settings/Terms';
import Thirdparty from './pages/settings/Thirdparty';
import MinifiedPlayer from './Components/MinifiedPlayer';
import Sidebar from './Components/Sidebar';
import Home from './pages/Home';
import Index from './pages';
import Cookies from "js-cookie"
import LikedSongsList from './Components/settings/LikedSongsList';
import Explore from './pages/Explore';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from './firebase-config';
import ArtistView from './pages/search/ArtistView';
import AlbumView from './pages/search/AlbumView';
import PlaylistView from './pages/search/PlaylistView';
import { getRoutes, PLAYER_MODE } from './constants';
import { getPath } from './utils/getPath';
import Library from './pages/Library';
// Define a styled component using the imported font
const StyledText = styled.div`
font-family: "Poppins", 'sans-serif'
`;
function App() {
  document.body.style.backgroundColor='#0000'
  const {pathName,setPathName, onReady,currentPlaying,songsList, setMessages,setNotification, playerMode}=useStateContext()
  const location = useLocation();
  const nav = useNavigate()

  const [paramsId, setParamsId] = useState("")

  const updateParamsId = useCallback((id)=>{
    setParamsId(id)
  },[])

  const isSolo = playerMode === PLAYER_MODE.SOLO;
  const ROUTE = getRoutes(isSolo);

  useEffect(() => {
    const checkAuthAndSetPath = () => {
      const currentPath = location.pathname;
      const uid = Cookies.get("uid");
      const email = Cookies.get("email");
      const name = Cookies.get("name");
  
      const isAuthenticated = uid && email && name;
  
      if (!isAuthenticated &&  !sessionStorage.getItem("roomCode") && currentPath !== "/") {
        // User not authenticated and not already on login page
        nav("/", { replace: true }); // redirect to login
        setPathName("login");
      } else {
        // Set pathName based on current path
        if (currentPath === "/") {
          setPathName("login");
        } else if(!sessionStorage.getItem("roomCode") && paramsId){
          sessionStorage.setItem("roomCode",paramsId)
          setPathName(currentPath);
        }
        else {
          setPathName(currentPath);
        }
      }
    };

    const getRealtimeMessages = () => {
      try{
        if (paramsId) {
          const filteredUsersQuery = query(
            collection(
              db,
              "room",
              paramsId || sessionStorage.getItem("roomCode"),
              "messages"
            ),
            orderBy("timestamp", "asc")
          );
          onSnapshot(filteredUsersQuery, (data) => {
            setMessages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            const unReadMsg = data.docs.filter(
              (doc) =>
                doc.data().status === "unread" &&
                doc.data().email !== Cookies.get("email")
            );
            setNotification(unReadMsg.length);
          });
        }
      }catch(err){
        console.log(err)
      }
    };
    getRealtimeMessages()
    
    checkAuthAndSetPath();
  }, [paramsId]);


  
  const roomCode = paramsId

  return (
    <div className='!bg-black h-screen overflow-x-hidden max-w-screen-sm'> 
      <StyledText>
      <Routes>
  <Route path='/' element={<Login  />} />
  <Route path={ROUTE.HOME} element={<Home />} />
  <Route path={ROUTE.EXPLORE} element={<Explore />} />
  <Route path={ROUTE.PLAYER} element={<Index updateParamsId={updateParamsId} />} />
  <Route path={ROUTE.SEARCH} element={<Search  />} />
  <Route path={ROUTE.ARTIST} element={<ArtistView  />} />
  <Route path={ROUTE.ALBUM} element={<AlbumView  />} />
  <Route path={ROUTE.PLAYLIST} element={<PlaylistView  />} />
  <Route path={ROUTE.CHAT} element={<Chat  />} />
  <Route path={ROUTE.LIBRARY} element={<Library  />} />
  <Route path='/settings' element={<Settings />} />
  <Route path='/settings/profile' element={<Profile />} />
  <Route path='/settings/rooms' element={<Rooms />} />
  <Route path='/settings/liked' element={<LikedSongsList />} />
  <Route path='/settings/about' element={<About />} />
  <Route path='/privacy-policy' element={<Privacypolicy />} />
  <Route path='/terms' element={<Terms />} />
  <Route path='/third-party' element={<Thirdparty />} />
</Routes>
{!["/", getPath(ROUTE.PLAYER, roomCode)].includes(pathName) && (isSolo || roomCode) && onReady && currentPlaying?.title && <MinifiedPlayer />}      {
        pathName!=='login' &&(<div className='bg-zinc-600 rounded-md'>
{
   
  !["/", "/discover", "/explore"].includes(pathName) && 
  (isSolo || roomCode) && 
  <YouTubeVideo videoIds={songsList} />
}        <Sidebar /> 
        </div>)
      }
      </StyledText>
    </div>
  );
}

export default App;
