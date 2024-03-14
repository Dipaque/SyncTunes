import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { db } from '../firebase-config';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

const YouTubeVideo = ({ videoIds }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentPlaying,setCurrentPlaying]=useState('')
  const onVideoEnd = () => {
    // setCurrentVideoIndex(prevIndex => prevIndex + 1);
    videoIds.splice(0,1)
    updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:videoIds,currentPlaying:videoIds[0]})
  };
  useEffect(() => {
    const getData=()=>{
      const docRef = doc(db,'room',sessionStorage.getItem('roomCode'))
    onSnapshot(docRef,(doc)=>{
        if(doc.exists){
          setCurrentPlaying(doc.data().currentPlaying)
        }
      })
    }
   getData()
   
 
  }, []);
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
      videoIds && (
<YouTube
        videoId={videoIds[0]}
        opts={opts}
        onEnd={onVideoEnd}
      />
      )
     } 
    </div>
  );
};

export default YouTubeVideo;