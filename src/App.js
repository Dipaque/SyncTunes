import React,{useEffect, useState} from 'react';
import './App.css';
import './index.css';
import Index from './pages';
import { Route, Routes,Router } from 'react-router-dom';
import Search from './pages/Search';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Homepage from './pages/Homepage';
function App() {
  document.body.style.backgroundColor='black'
  return (
    <React.Fragment> 
      <div className='bg-black mx-auto '>
      <Homepage /> 
      </div>
      
      <Routes>
      <Route path='/' element={<Login  />} />
        {/* <Route path='/home' element={<></>} /> */}
        <Route path='/search' element={<Search  />} />
        <Route path='/chat' element={<Chat  />} />
      </Routes>
      
    </React.Fragment>
  );
}

export default App;
