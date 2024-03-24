import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

const addToQueue=async(image,title,id,channelName,songs)=>{
    songs.splice(songs.length,0,{image,title,id,channelName})
    await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[...songs]}).catch(err=>console.log(err)) 
}
export default addToQueue
