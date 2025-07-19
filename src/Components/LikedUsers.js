import React, { useEffect, useState } from 'react'
import { useStateContext } from "../Context/ContextProvider";

const LikedUsers = () => {

    const [avatars,setAvatars] = useState([])
    const {songsList,currentPlaying} = useStateContext()
    useEffect(()=>{
        const currentSong = songsList.find((song)=> song.id===currentPlaying.id)?.likedBy
        setAvatars(currentSong)

    },[currentPlaying,songsList]) 

  return (
<div className='flex items-center gap-2 text-xs text-slate-200'>
{avatars && avatars?.length>0 && "Liked by"}
    <div className='flex -space-x-1 overflow-hidden'>{
        avatars && avatars?.map((user)=>(
            <img src={user.avatar} className='h-5 w-5 rounded-full' alt='profile' />
        )) 
    }</div>
</div>
  )
}

export default LikedUsers