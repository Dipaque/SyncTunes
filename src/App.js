import React,{useCallback, useEffect, useState,} from 'react';
import './App.css';
import './index.css';
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
// Define a styled component using the imported font
const StyledText = styled.div`
font-family: "Poppins", 'sans-serif'
`;
function App() {
  document.body.style.backgroundColor='#0000'
  const {pathName,setPathName, onReady,title,songsList}=useStateContext()
  const location = useLocation();
  const nav = useNavigate()

  const [paramsId, setParamsId] = useState("")

  const updateParamsId = useCallback((id)=>{
    setParamsId(id)
  },[])

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
    
    checkAuthAndSetPath();
  }, [paramsId]);
  
  const roomCode = paramsId

  return (
    <div className='!bg-black h-screen overflow-x-hidden'> 
      <StyledText>
          <Routes>
      <Route path='/' element={<Login  />} />
        <Route path='/home' element={<Home />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/room/:id/player' element={<Index updateParamsId={updateParamsId} />} />
        <Route path='/room/:id/search' element={<Search  />} />
        <Route path='/room/:id/chat' element={<Chat  />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/settings/profile' element={<Profile />} />
        <Route path='/settings/rooms' element={<Rooms />} />
        <Route path='/settings/liked' element={<LikedSongsList />} />
        <Route path='/settings/about' element={<About />} />
        <Route path='/privacy-policy' element={<Privacypolicy />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/third-party' element={<Thirdparty />} />
      </Routes>
    {!["/","/home",`/room/${roomCode}/player`].includes(pathName) && onReady && title && <MinifiedPlayer />}
      {
        pathName!=='login' &&(<div className='bg-zinc-600 rounded-md'>
        {songsList?.length>0 && !["/",'/home','/discover'].includes(pathName) && sessionStorage.getItem("roomCode") && <YouTubeVideo videoIds={songsList} />}
        <Sidebar /> 
        </div>)
      }
      </StyledText>
    </div>
  );
}

export default App;
