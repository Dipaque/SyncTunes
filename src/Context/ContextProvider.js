import React , {useContext,createContext,useState,useEffect} from "react";
import {collection,getDoc,query,where,orderBy,onSnapshot,doc,getDocs, addDoc, Timestamp, updateDoc,} from 'firebase/firestore'
import Cookies from 'js-cookie'
import { db } from '../firebase-config'
const StateContext=createContext();
export const ContextProvider=({children})=>{
    const [videoId,setVideoId]=useState('')
    const [modal_backdrop,setmodal_backdrop]=useState(false)
    const [modal_backdrop1,setmodal_backdrop1]=useState(false)
    const [joineeSong,setJoineeSong]=useState('')
    const [pathName,setPathName]=useState('')
    const [videoIds,setVideoIds]=useState([])
    const [notification,setNotification]=useState(0)
    const [messages,setMessages]=useState([])
    const [isLeaving,setIsLeaving] = useState(false)
    const [onReady,setOnReady] = useState()
    const [title,setTitle] = useState('')
    const [artist,setArtist]=useState('')
    const [currentPlaying,setCurrentPlaying] = useState('')
    useEffect(()=>{
        const getData=()=>{
            if(sessionStorage.getItem('roomCode')){
                const filteredUsersQuery = query(collection(db,'room',sessionStorage.getItem('roomCode'),'messages'),orderBy('timestamp','asc'));
                onSnapshot(filteredUsersQuery,((data) => {
                  setMessages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
                  const unReadMsg =  data.docs.filter((doc)=>(doc.data().status==='unread' && doc.data().sender!==Cookies.get('name')))
                  setNotification(unReadMsg.length)
                }
                ))
            }
        }
        getData()
        
    },[sessionStorage.getItem('roomCode')])
    return (<StateContext.Provider value={{videoId,setVideoId,modal_backdrop,setmodal_backdrop,modal_backdrop1,setmodal_backdrop1,joineeSong,setJoineeSong,pathName,setPathName,notification,setNotification,videoIds,setVideoIds,messages,setMessages,isLeaving,setIsLeaving,setOnReady,onReady,title,setTitle,artist,setArtist,currentPlaying,setCurrentPlaying}}>
        {children}
    </StateContext.Provider>)
}
export const useStateContext = () => useContext(StateContext);