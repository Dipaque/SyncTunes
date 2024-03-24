import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiAccountCircleOutline, mdiDoorOpen, mdiLogout } from '@mdi/js';
import Cookies from 'js-cookie';
import YouTubeVideo from '../Components/YoutubeVideo';
import { useStateContext } from '../Context/ContextProvider';
import { db } from '../firebase-config';
import CreateRoom from '../Components/CreateRoom';
import JoinRoom from '../Components/JoinRoom';
import {collection,getDoc,query,where,orderBy,onSnapshot,doc,getDocs,} from 'firebase/firestore'
const Index = () => {

   
    const {videoId,modal_backdrop,setmodal_backdrop,joineeSong,setJoineeSong,setmodal_backdrop1} =useStateContext()

  return (
   <>
   {
    !sessionStorage.getItem('roomCode') && (<>
   
      <div className=' flex justify-center gap-2 mb-5  mx-auto'>
      <button className='border pl-2 pr-2 bg-slate-50   p-2 rounded-lg text-black' type='button' onClick={()=>{
        setmodal_backdrop(true)
      }}>
        New Room
      </button>
      <button className='border-zinc-500 border-1 pl-2 pr-2    p-2 rounded-lg text-white' onClick={()=>{
        setmodal_backdrop1(true)
      }}>
        Join with a code
      </button>      
    </div>
    <div className='flex flex-col justify-center items-center mt-14 m-3 text-slate-50'>
<img src={require('../assests/recorder.png')}  height={200} width={200} />
<h5><b>Get the link that you can share</b></h5>
<p className='text-sm text-center'>Tap on new room to generate your own room code and share it with your friends!</p>
</div>
</>
    )
   }
   </>
       
        )
      }
    
export default Index