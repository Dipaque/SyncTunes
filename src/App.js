import React,{useEffect, useState} from 'react';
import './App.css';
import './index.css';
import Index from './pages';
import { Route, Routes } from 'react-router-dom';
import Search from './pages/Search';
import Login from './pages/Login';
import Chat from './pages/Chat';
function App() {

  return (
    <React.Fragment>  
      <Routes>
      <Route path='/' element={<Login  />} />
        <Route path='/home' element={<Index  />} />
        <Route path='/search' element={<Search  />} />
        <Route path='/chat' element={<Chat  />} />
      </Routes>
      
    </React.Fragment>
  );
}

export default App;
