import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";
const playNext=async(image,title,id,channelName,songs,currentPlaying)=>{
    if(songs){
        const index = songs.findIndex(data => data.id === currentPlaying.id)
        songs.splice(index+1,0,{image,title,id,channelName})
        await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[...songs]}).catch(err=>console.log(err)) 
    } 
}
export default playNext;