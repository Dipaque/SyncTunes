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
    // console.log(isPlaying,currentSong.length)
  return (
    
    
            <>

    
    </>
            
        )
      }
    
export default Index