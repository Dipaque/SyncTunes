import React, { useEffect, useState } from 'react'
import { useStateContext } from '../Context/ContextProvider';
import { IoPause, IoPlay, IoPlaySkipBack, IoPlaySkipForward } from 'react-icons/io5';
import Marquee from 'react-fast-marquee';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import {  secondsToMinutes, seekBarStyle } from '../Functions/secondsToMinutes';
const Index = () => {
  const { videoIds, setmodal_backdrop, onReady, setmodal_backdrop1, title, artist, currentPlaying, duration, setDuration, currentTime, setCurrentTime, isSeeking, setIsSeeking, seekBarRef,} = useStateContext()
  const [isPause, setIsPause] = useState(false)
  const handleForward = async () => {
    const index = videoIds.findIndex(data => data.id === currentPlaying.id)
    if (index !== videoIds.length-1) {
      await updateDoc(doc(db, 'room', sessionStorage.getItem('roomCode')), { currentPlaying: videoIds[index + 1] }).catch(err => console.log(err))
    }  
    setCurrentTime(0)
  }
  const handleBack = async () => {
    const index = videoIds.findIndex(data => data.id === currentPlaying.id)
    if (index > 0) {
      await updateDoc(doc(db, 'room', sessionStorage.getItem('roomCode')), { currentPlaying: videoIds[index - 1] }).catch(err => console.log(err))
    }
    setCurrentTime(0)
  }
  const handlePause = () => {
    onReady.pauseVideo()
    setIsPause(true)
  }
  const handlePlay = () => {
    onReady.playVideo()
    setIsPause(false)
  }
  const handleMouseDown = () => {
    setIsSeeking(true);
  };

  const handleMouseUp = () => {
    setIsSeeking(false);
  };
  const handleSeek = (event) => {
    if (onReady) {
      const seekToTime = (event.nativeEvent.offsetX / seekBarRef.current.offsetWidth) * duration;
      onReady.seekTo(seekToTime);
      setCurrentTime(seekToTime)
    }
  };
  const progressBarStyle = {
    width:`${(currentTime / duration) * 100}%` ,
    height: '100%',
  };
  
  return (
    <>
      {
        !sessionStorage.getItem('roomCode') ? (<>

          <div className=' flex justify-center gap-2 mb-5  mx-auto'>
            <button className='border pl-2 pr-2 bg-slate-50   p-2 rounded-lg text-black' type='button' onClick={() => {
              setmodal_backdrop(true)
            }}>
              New Room
            </button>
            <button className='border-zinc-500 border-1 pl-2 pr-2    p-2 rounded-lg text-white' onClick={() => {
              setmodal_backdrop1(true)
            }}>
              Join with a code
            </button>
          </div>
          <div className='flex flex-col justify-center items-center mt-14 m-3 text-slate-50'>
            <img src={require('../assests/recorder.png')} height={200} width={200} />
            <h5><b>Get the link that you can share</b></h5>
            <p className='text-sm text-center'>Tap on new room to generate your own room code and share it with your friends!</p>
          </div>
        </>
        ) : (<>
          <div className='m-3'>
            <Marquee>
              <h5 className='text-slate-50 '>
                <b>
                  {
                    title
                  }
                </b>
              </h5>
            </Marquee>

            <p className='text-slate-200 m-2'>
              {
                artist
              }
            </p>
          </div>
          <div className=" bg-zinc-800 border-zinc-800 border-2 rounded-full  h-1.5 cursor-pointer mx-auto" ref={seekBarRef} onClick={handleSeek} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} style={seekBarStyle}>
        <div className="seek-bar-progress bg-slate-100 rounded-full " style={progressBarStyle}></div>
        </div>
        <div className='mt-2 flex items-center justify-between  text-slate-50 text-sm m-3'>
          <span >
          {
            secondsToMinutes(currentTime)
          }
          </span>
          <span >
          {
           secondsToMinutes(duration)
          }
          </span>
        </div>

          <div className='flex justify-center items-center mt-8 gap-8'>
            <div className='bg-zinc-800 rounded-full p-3 text-center' onClick={() => handleBack()}>
              <IoPlaySkipBack size={26} color={'white'} />
            </div>
            {
              isPause ? (<div className='bg-zinc-800 rounded-full p-3 text-center' onClick={() => handlePlay()}>
                <IoPlay size={26} color={'white'} />
              </div>) : (<div className='bg-zinc-800 rounded-full p-3 text-center' onClick={() => handlePause()}>
                <IoPause size={26} color={'white'} />
              </div>)
            }
            <div className='bg-zinc-800 rounded-full p-3 text-center' onClick={() => handleForward()}>
              <IoPlaySkipForward size={26} color={'white'} />
            </div>
          </div></>)
      }
    </>
  )
}

export default Index