import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../firebase-config';
import Cookies from "js-cookie"
import SongCard from '../SongCard';
import PageHeader from '../layout/PageHeader';
import { IoSearchOutline } from 'react-icons/io5';
import Toast from '../Toast';
import Spinner from '../loading/Spinner';

const LikedSongsList = () => {

    const [likedSongs, setLikedSongs] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState("");
    const [toastMsg, setToastMsg] = useState("");
  const [toastDisplay, setToastDisplay] = useState(false);

    const getLikedSongs = async () => {
        setLoading(true)
        const email = Cookies.get("email")

        try {
          const q = query(
            collection(db, "users"),
            where("email", "==", email)
          );
      
          const querySnapshot = await getDocs(q);
      
          if (querySnapshot.empty) {
            setLikedSongs([]);
            setLoading(false)
          }
      
          const userDoc = querySnapshot.docs[0];
          const likedSongs = userDoc.data().likedSongs || [];

          // remove duplicates based on song.id
          const uniqueLikedSongs = Array.from(
            new Map(likedSongs.map(song => [song.id, song])).values()
          );
          setLikedSongs(uniqueLikedSongs);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching liked songs:", error);
          setLikedSongs([]);
          setLoading(false)
        }
      };
      
    useEffect(()=>{
     getLikedSongs();
    },[])

    useEffect(()=>{
        if(input){
            const filteredSongs = likedSongs.filter((song)=>song.title.toLowerCase().includes(input.toLowerCase()))
            setSearchResult(filteredSongs)
        }
    },[input])

  return (
    <div className='h-screen overflow-hidden overflow-y-auto'>
        
    <PageHeader title={"Liked Songs"} />
    <div className='p-3  mb-28'>
    {
        loading ? <Spinner /> :     <>
        <div className="mx-auto mb-5 relative w-fit">
      <IoSearchOutline
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none z-50"
        size={16}
      />
    
      <input
        type="text"
        value={input}
        onChange={(e)=>setInput(e.target.value)}
        placeholder="Find in Liked Songs"
        className="w-64 bg-zinc-900/50 backdrop-blur-md rounded-md py-2 pr-3 pl-10 text-white text-xs font-semibold placeholder:text-white/60 focus:outline-none"
      />
    </div>
    <div className='flex items-center text-white/70 justify-between mb-4 m-3 text-xs font-semibold'>
        Total {likedSongs.length} Songs
    </div>
    
            {
                input && searchResult.length > 0 ? searchResult?.map((song)=>(
                    <SongCard key={song?.id} title={song.title} id={song?.id} image={song?.image} channelName={song?.channelName}  setToastDisplay={setToastDisplay}
                    setToastMsg={setToastMsg} />
                )):
                !input && likedSongs.length > 0 ?  likedSongs?.map((song)=>(
                    <SongCard key={song?.id} title={song.title} id={song?.id} image={song?.image} channelName={song?.channelName}  setToastDisplay={setToastDisplay}
                    setToastMsg={setToastMsg} />
                )) :(<div className="text-center mt-5 text-slate-100">
                    No songs found that you like!
                  </div>)
            }
        </>
    } 

    </div>
    {toastDisplay && (
    <div className="flex justify-center">
      <Toast message={toastMsg} showToast={toastDisplay} />
    </div>
  )}
    </div>
  )
}

export default LikedSongsList