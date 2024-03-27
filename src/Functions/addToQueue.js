import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

const addToQueue=async(image,title,id,channelName,songs)=>{
    if(songs){
        songs.splice(songs.length,0,{image,title,id,channelName})
        await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[...songs]}).catch(err=>console.log(err)) 
    }else {
        await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[{image,title,id,channelName}],currentPlaying:{image,title,id,channelName}}).catch(err=>console.log(err))
    }
    
}
export default addToQueue
