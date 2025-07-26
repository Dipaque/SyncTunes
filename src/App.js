import React,{useEffect,} from 'react';
import './App.css';
import './index.css';
import { Route, Routes,useLocation, useNavigate } from 'react-router-dom';
import YouTubeVideo from "../src/Components/YoutubeVideo"
import Search from './pages/Search';
import Login from './pages/Login';
import Chat from './pages/Chat';
import styled from 'styled-components'; // or import { css } from '@emotion/react';
import { useStateContext } from './Context/ContextProvider';
import Profile from './pages/Profile';
import Privacypolicy from './pages/Privacypolicy';
import Terms from './pages/Terms';
import Thirdparty from './pages/Thirdparty';
import MinifiedPlayer from './Components/MinifiedPlayer';
import Sidebar from './Components/Sidebar';
import Home from './pages/Home';
import Index from './pages';
import Cookies from "js-cookie"
// Define a styled component using the imported font
const StyledText = styled.div`
font-family: "Poppins", 'sans-serif'
`;
function App() {
  document.body.style.backgroundColor='#0000'
  const {pathName,setPathName, onReady,title,videoIds}=useStateContext()
  const location = useLocation();
  const nav = useNavigate()
  useEffect(() => {
    const checkAuthAndSetPath = () => {
      const currentPath = location.pathname;
      const uid = Cookies.get("uid");
      const email = Cookies.get("email");
      const name = Cookies.get("name");
  
      const isAuthenticated = uid && email && name;
  
      if (!isAuthenticated && !sessionStorage.getItem("roomCode") && currentPath !== "/") {
        // User not authenticated and not already on login page
        nav("/", { replace: true }); // redirect to login
        setPathName("login");
      } else {
        // Set pathName based on current path
        if (currentPath === "/") {
          setPathName("login");
        } else {
          setPathName(currentPath);
        }
      }
    };
  
    checkAuthAndSetPath();
  }, [location.pathname]);
  

  const roomCode = sessionStorage.getItem("roomCode");

  return (
    <div className='!bg-black h-screen'> 
      <StyledText>
      {
        pathName!=='login' &&(<div className='bg-black mx-auto sticky top-0'>
        {videoIds?.length>0 && !["/",'/home'].includes(pathName) && <YouTubeVideo videoIds={videoIds} />}
        <Sidebar /> 
        </div>)
      }
      <Routes>
      <Route path='/' element={<Login  />} />
        <Route path='/home' element={<Home />} />
        <Route path='/room/:id/player' element={<Index />} />
        <Route path='/room/:id/search' element={<Search  />} />
        <Route path='/room/:id/chat' element={<Chat  />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/privacy-policy' element={<Privacypolicy />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/third-party' element={<Thirdparty />} />
      </Routes>
    {!["/","/home",`/room/${roomCode}/player`].includes(pathName) && onReady && title && <MinifiedPlayer />}
      </StyledText>
    </div>
  );
}

export default App;
