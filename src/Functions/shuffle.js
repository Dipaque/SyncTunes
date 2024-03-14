import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

const shuffule = async(id,songs) =>{
    const randomIndex = Math.floor(Math.random()*songs.length+1)
    songs.splice(randomIndex,0,id)
    await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[...songs]}).catch(err=>console.log(err)) 
}
export default shuffule