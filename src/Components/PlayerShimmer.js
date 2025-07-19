import React from 'react'
import Marquee from 'react-fast-marquee';
// import { HiMusicalNote } from 'react-icons/hi2'
import { IoHeart, IoPause, IoPlaySkipBack, IoPlaySkipForward } from 'react-icons/io5';

const PlayerShimmer = () => {
  return (
    <div className='animate-pulse'>
      <div className='flex items-center'>
       <Marquee style={{ width: "85%" }}>
                <h5 className="text-slate-50 bg-black">
                  <b>{"Song name"}</b>
                </h5>
              </Marquee>
        <IoHeart size={38} className='animate-pulse' />
      </div>
      <div className=" bg-[#4d4d4d] w-[90%]  border-zinc-800 border-2 rounded-full  h-1.5 mt-3 cursor-pointer mx-auto" />
      <div className='flex justify-center items-center mt-8 gap-8 mb-5'>
            <div className='bg-zinc-800 rounded-full p-3 text-center' >
              <IoPlaySkipBack size={26} color={'white'} />
            </div>
            <div className='bg-zinc-800 rounded-full p-3 text-center' >
                <IoPause size={26} color={'white'} />
              </div>
            <div className='bg-zinc-800 rounded-full p-3 text-center'>
              <IoPlaySkipForward size={26} color={'white'} />
            </div>
          </div>
     </div>
  )
}

export default PlayerShimmer