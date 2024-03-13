import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiAccountCircleOutline, mdiDoorOpen, mdiLogout } from '@mdi/js';
import Cookies from 'js-cookie';
import YouTubeVideo from '../Components/YoutubeVideo';
import { useStateContext } from '../Context/ContextProvider';
import { db,auth } from '../firebase-config';
import CreateRoom from '../Components/CreateRoom';
import JoinRoom from '../Components/JoinRoom';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import Index from './index';
import { BiPowerOff } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import {collection,getDoc,query,where,orderBy,onSnapshot,doc,getDocs,} from 'firebase/firestore'
const Homepage = () => {
  const nav = useNavigate()
    // const [greeting,setGreetings]=useState('')
    const [currentSong,setCurrentSong,]=useState([])
    const {videoId,modal_backdrop,setmodal_backdrop,joineeSong,setJoineeSong,setmodal_backdrop1} =useStateContext()
   const [song,setSong]=useState('')
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const signOut=()=>{
     signOut(auth).then(() => {
       nav('/')
     }).catch((error) => {
       console.log(error)
     });
   }
   
   const toggle = () => setDropdownOpen((prevState) => !prevState);
   
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
      <div className='text-white  mt-3 text-lg ml-3 flex justify-start  items-center   '>
      <b className=' '>{'Welcome '+Cookies.get('name')}</b>
      
      </div>
      {

        sessionStorage.getItem('roomCode') && currentSong.length>0 && ( <div className=' flex items-center  justify-center flex-col mt-5 '>
            <YouTubeVideo videoId={currentSong[0].currentSong} />
            <button className='border-white border-2 pl-2 pr-2  mt-5 mx-auto   p-2 rounded-lg text-white flex flex-row justify-center items-center gap-2'
            type='buttom'
             onClick={()=>handleLeaveRoom()}>
                Leave Room
                <Icon path={mdiLogout} size={0.9}/>
            </button>
            </div>) 
          
}
</div>
</div>
</>
  )
}






export default Homepage