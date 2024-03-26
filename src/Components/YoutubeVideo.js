import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { db } from '../firebase-config';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Marquee from 'react-fast-marquee';
import { useStateContext } from '../Context/ContextProvider';
const YouTubeVideo = ({ videoIds }) => {
  const intervalRef=useRef(null)
  const [id,setId]=useState('')
  const {setOnReady,setTitle,setArtist,setVideoIds,currentPlaying,setCurrentPlaying,duration,setDuration,currentTime,setCurrentTime,isSeeking,setIsSeeking,seekBarRef,onReady,setProgressBarWidth} = useStateContext()
  const onVideoEnd = () => {
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
  }, []);
 
  const onReadyFunc = (event) => {
    setOnReady(event.target)
    setDuration(event.target.getDuration())
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
      controls: 0, 
      disablekb: 1,
      modestbranding: 1
      
    },
  };
  const onStateChange = (event) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      startInterval();
    } else {
      clearInterval(intervalRef.current);
    }
  };

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentTime(prevCurrentTime => {
        const newCurrentTime = onReady.getCurrentTime();
        if (Math.abs(newCurrentTime - prevCurrentTime) > 1) {
          return newCurrentTime;
        }
        return prevCurrentTime;
      })
    }, 500);
  };

  return (
    <div>
     {
      id && (<>
<YouTube
        videoId={id}
        opts={opts}
        onReady={onReadyFunc}
        onStateChange={onStateChange}
        onEnd={onVideoEnd}
      />
      </>
      )
     } 
    </div>
  );
};
export default YouTubeVideo;