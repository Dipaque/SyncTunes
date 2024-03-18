import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";
const playNext=async(id,songs)=>{
    if(songs){
        songs.splice(1,0,id)
        await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[...songs]}).catch(err=>console.log(err)) 
    } 
}
export default playNext;