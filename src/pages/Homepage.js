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
import Index from './index';
import {collection,getDoc,query,where,orderBy,onSnapshot,doc,getDocs,} from 'firebase/firestore'
const Homepage = () => {
    // const [greeting,setGreetings]=useState('')
    const [currentSong,setCurrentSong,]=useState([])
    const [isPlaying,setIsPlaying]=useState('')
    const {videoId,modal_backdrop,setmodal_backdrop,joineeSong,setJoineeSong,setmodal_backdrop1} =useStateContext()
   const name = Cookies.get('name').split(' ')
   const [song,setSong]=useState('')
    useEffect(()=>{
        const getData=()=>{
            if(sessionStorage.getItem('roomCode')){
            const filteredUsersQuery = query(collection(db, 'room'), where('roomCode', '==', sessionStorage.getItem('roomCode')));
            onSnapshot(filteredUsersQuery,((data) => {
              setCurrentSong(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            })) 
            
        }
        }
      getData()  
    },[sessionStorage.getItem('roomCode')])
    
    const handleLeaveRoom=()=>{
        sessionStorage.removeItem('roomCode')
        setJoineeSong('')
        setCurrentSong([])
        
    }
  return (
    <>
    <Sidebar />
     <div className="flex justify-center gap-0 h-full  w-screen  bg-black ">
     <CreateRoom />
     <JoinRoom />
    
    <div className=' m-3 mb-5  rounded-lg w-96 '>
      <div className='text-white  mt-8 text-2xl flex  justify-around mr-4   '>
      <b className='relative left-0 w-52'>{'Welcome '+name[0]}</b>
      {
        Cookies.get('photoUrl') ? <div className='h-9 relative right-1'> <img src={Cookies.get('photoUrl')} className='rounded-full h-9' /></div>:<Icon className='' path={mdiAccountCircleOutline} color={'white'} size={1.4} />
      }
      
      </div>
      {

        sessionStorage.getItem('roomCode') && currentSong.length>0 ?( <div className='mt-20 flex justify-center flex-col '>
            <YouTubeVideo videoId={currentSong[0].currentSong} />
            <button className='border-white border-2 pl-2 pr-2 w-40 mt-5 mx-auto   p-2 rounded-lg text-white flex flex-row justify-center items-center gap-2'
            type='buttom'
             onClick={()=>handleLeaveRoom()}>
                Leave Room
                <Icon path={mdiLogout} size={0.9}/>
            </button>
            </div>) :(
            !sessionStorage.getItem('roomCode') && joineeSong &&(
            <div className='mt-20 flex justify-center flex-col '>
                
                <button className=' border-white border-2 mx-auto pl-2 pr-2 w-40 mt-5  p-2 rounded-lg text-white flex flex-row justify-center items-center gap-2'
                type='button'
                 onClick={()=>handleLeaveRoom()}>Leave Room
                <Icon path={mdiDoorOpen} size={0.9}/>
                </button>
            </div>
            )
            )
          
}
</div>
</div>
</>
  )
}






export default Homepage