import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

const shuffule = async(image,title,id,channelName,songs) =>{
    const randomIndex = Math.floor(Math.random()*songs.length+1)
    songs.splice(randomIndex,0,{image,title,id,channelName})
    await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[...songs]}).catch(err=>console.log(err)) 
}
export default shuffule