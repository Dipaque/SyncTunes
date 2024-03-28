import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";
const playNext=async(image,title,id,channelName,songs,currentPlaying,name)=>{
    if(songs){
        const index = songs.findIndex(data => data.id === currentPlaying.id)
        songs.splice(index+1,0,{image,title,id,channelName,playedBy:name})
        await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[...songs]}).catch(err=>console.log(err)) 
    } 
}
export default playNext;