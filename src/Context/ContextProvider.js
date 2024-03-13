import React , {useContext,createContext,useState,useEffect} from "react";
const StateContext=createContext();
export const ContextProvider=({children})=>{
    const [videoId,setVideoId]=useState('')
    const [modal_backdrop,setmodal_backdrop]=useState(false)
    const [modal_backdrop1,setmodal_backdrop1]=useState(false)
    const [joineeSong,setJoineeSong]=useState('')
    const [pathName,setPathName]=useState('')
    const [notification,setNotification]=useState(0)
    return (<StateContext.Provider value={{videoId,setVideoId,modal_backdrop,setmodal_backdrop,modal_backdrop1,setmodal_backdrop1,joineeSong,setJoineeSong,pathName,setPathName,notification,setNotification}}>
        {children}
    </StateContext.Provider>)
}
export const useStateContext = () => useContext(StateContext);