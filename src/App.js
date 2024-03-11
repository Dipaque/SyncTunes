import React,{useEffect, useState} from 'react';
import './App.css';
import './index.css';
import Index from './pages';
import { Route, Routes,Router } from 'react-router-dom';
import Search from './pages/Search';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Homepage from './pages/Homepage';
import styled from 'styled-components'; // or import { css } from '@emotion/react';

// Define a styled component using the imported font
const StyledText = styled.div`
font-family: "Poppins", 'sans-serif'
`;
function App() {
  document.body.style.backgroundColor='black'
  return (
    <React.Fragment> 
      <StyledText>
      {
        document.location.pathname!=='/' && (<div className='bg-black mx-auto '>
        <Homepage /> 
        </div>)
      }
      
      
      <Routes>
      <Route path='/' element={<Login  />} />
        <Route path='/home' element={<Index />} />
        <Route path='/search' element={<Search  />} />
        <Route path='/chat' element={<Chat  />} />
      </Routes>
      </StyledText>
    </React.Fragment>
  );
}

export default App;
