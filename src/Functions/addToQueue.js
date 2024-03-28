import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

const addToQueue=async(image,title,id,channelName,songs,name)=>{
    if(songs){
        songs.splice(songs.length,0,{image,title,id,channelName,playedBy:name})
        await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[...songs]}).catch(err=>console.log(err)) 
    }else {
        await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[{image,title,id,channelName,playedBy:name}],currentPlaying:{image,title,id,channelName,playedBy:name}}).catch(err=>console.log(err))
    }
    
}
export default addToQueue
