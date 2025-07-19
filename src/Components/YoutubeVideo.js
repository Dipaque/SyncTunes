import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { db } from '../firebase-config';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useStateContext } from '../Context/ContextProvider';
import { HiMusicalNote } from 'react-icons/hi2';
import { getUniqueObjectsById } from '../Functions/removeDupes';
const YouTubeVideo = ({ videoIds }) => {
  const intervalRef=useRef(null)
  const [id,setId]=useState('')
  const {setOnReady,setTitle,setArtist,setVideoIds,currentPlaying,setCurrentPlaying,setDuration,setCurrentTime,onReady,setPlayedBy,setIsLoading,isLoading,pathName,thumbnail,setThumbnail} = useStateContext()
  const onVideoEnd = () => {
    if(videoIds.length>1 ){
      const index = videoIds.findIndex(data => data.id === currentPlaying.id)
      if(index<videoIds.length-1){
        const uniqueVideoIds = getUniqueObjectsById(videoIds)
        updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:uniqueVideoIds,currentPlaying:videoIds[index+1]}).catch(err=>console.log(err))
      }
    }
    else{
      updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentPlaying:videoIds[0]}).catch(err=>console.log(err))
    }
    if(onReady) onReady.seekTo(0)
    setCurrentTime(0)
   
  };
  useEffect(() => {
      const docRef = doc(db,'room',sessionStorage.getItem('roomCode'))
   const unsubscribe = onSnapshot(docRef,(doc)=>{
        if(doc.exists()){
          setVideoIds(doc.data().currentSong)
          if(doc.data().currentPlaying){
            setCurrentPlaying(doc.data().currentPlaying)
            setId(doc.data().currentPlaying.id)
            setTitle(doc.data().currentPlaying.title)
            setArtist(doc.data().currentPlaying.channelName)
            setPlayedBy(doc.data().currentPlaying.playedBy)
            setThumbnail(doc?.data()?.currentPlaying.image)
          }
        }
      })
   return ()=> unsubscribe()
  }, [videoIds]);
 
  const onReadyFunc = (event) => {
    setOnReady(event.target)
    setDuration(event.target.getDuration())
    setIsLoading(false)
  };
  const opts = {
    height: '30',
    width: '30', 
    playerVars: {
      autoplay: 1,
      fs: 0,
      rel: 0,
      showinfo: 0,
      loop:1,
      controls: 0, 
      disablekb: 1,
      modestbranding: 1,
      showRelatedVideos: 0
      
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
    <div className='m-3'>
     {
      id || !isLoading || thumbnail ? (<><div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: -1 }}>
<YouTube
        videoId={id}
        className=''
        opts={opts}
        onReady={onReadyFunc}
        onStateChange={onStateChange}
        onEnd={onVideoEnd}
      />
      </div>
      {thumbnail && pathName==="/home" && <img src={thumbnail ||""} alt='thumbnail' className='h-60 w-65' />}
      </>
      ):(pathName==="/home" && <div className='h-60 w-60 mt-3 bg-zinc-800 rounded-lg flex justify-center items-center animate-pulse'>
          <p>
            <HiMusicalNote color='black' size={86} />
          </p>
      </div>)
     } 
    </div>
  );
};
export default YouTubeVideo;