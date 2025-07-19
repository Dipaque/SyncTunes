import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase-config"

export const fetchSongsList = async() =>{
    try{
        const roomCode = sessionStorage.getItem("roomCode");
        const docRef =  doc(db,"room",roomCode);
        const songs = (await getDoc(docRef))?.data()?.currentSong;
        return songs
    }catch(err){
        console.log(err)
    }
}