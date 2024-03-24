import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { db } from '../firebase-config';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Marquee from 'react-fast-marquee';
import { useStateContext } from '../Context/ContextProvider';
const YouTubeVideo = ({ videoIds }) => {
  const [id,setId]=useState('')
  const {setOnReady,setTitle,setArtist,setVideoIds,currentPlaying,setCurrentPlaying} = useStateContext()
  const onVideoEnd = () => {
    // setCurrentVideoIndex(prevIndex => prevIndex + 1);
    if(videoIds.length>1){
      videoIds.splice(0,1)
      updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:videoIds,currentPlaying:videoIds[0]}).catch(err=>console.log(err))
    }
    else{
      updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:videoIds,currentPlaying:videoIds[0]}).catch(err=>console.log(err))
    }
   
  };
  useEffect(() => {
    const getData=()=>{
      const docRef = doc(db,'room',sessionStorage.getItem('roomCode'))
    onSnapshot(docRef,(doc)=>{
        if(doc.exists()){
          setVideoIds(doc.data().currentSong)
          setId(doc.data().currentPlaying.id)
          setCurrentPlaying(doc.data().currentPlaying)
          setTitle(doc.data().currentPlaying.title)
          setArtist(doc.data().currentPlaying.channelName)
        }
      })
    }
   getData()
  }, [id]);
  console.log(id)
  
  const onReady = (event) => {
    setOnReady(event.target)
  };
  const opts = {
    height: '200',
    width: '100%', 
    playerVars: {
      autoplay: 1,
      fs: 0,
      rel: 0,
      showinfo: 0,
      loop:1,
    },
  };
  return (
    <div>
     {
      id && (<>
<YouTube
        videoId={id}
        opts={opts}
        onReady={onReady}
        onEnd={onVideoEnd}
      />
      </>
      )
     } 
    </div>
  );
};
export default YouTubeVideo;