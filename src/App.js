import React,{useEffect, useState} from 'react';
import './App.css';
import './index.css';
import Index from './pages';
import { Route, Routes,Router,useLocation } from 'react-router-dom';
import Search from './pages/Search';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Homepage from './pages/Homepage';
import styled from 'styled-components'; // or import { css } from '@emotion/react';
import { useStateContext } from './Context/ContextProvider';
import Profile from './pages/Profile';
import Privacypolicy from './pages/Privacypolicy';
import Terms from './pages/Terms';
import Thirdparty from './pages/Thirdparty';
import MinifiedPlayer from './Components/MinifiedPlayer';
// Define a styled component using the imported font
const StyledText = styled.div`
font-family: "Poppins", 'sans-serif'
`;
function App() {
  document.body.style.backgroundColor='#0000'
  const {pathName,setPathName, onReady,title,}=useStateContext()
  const location = useLocation();
  useEffect(()=>{
    const getPathName=()=>{
      if(location.pathname==='/'){
        setPathName('login')
      }else{
        setPathName(location.pathname)
      }
    }
   getPathName()
  },[location.pathname])

  
  return (
    <div className='!bg-black !min-h-screen'> 
      <StyledText>
      {
        pathName!=='login' &&(<div className='bg-black mx-auto '>
        <Homepage /> 
        </div>)
      }
      <Routes>
      <Route path='/' element={<Login  />} />
        <Route path='/home' element={<Index />} />
        <Route path='/search' element={<Search  />} />
        <Route path='/chat' element={<Chat  />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/privacy-policy' element={<Privacypolicy />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/third-party' element={<Thirdparty />} />
      </Routes>
    {!["/","/home"].includes(pathName) && onReady && title && <MinifiedPlayer />}
      </StyledText>
    </div>
  );
}

export default App;
