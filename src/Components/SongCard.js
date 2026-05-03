import React, {useState} from 'react'
import { useStateContext } from '../Context/ContextProvider'
import { db } from '../firebase-config'
import {  doc, Timestamp, updateDoc } from 'firebase/firestore'
import { HiOutlineQueueList, } from "react-icons/hi2";
import { IoEllipsisVertical, IoRepeatOutline, IoShuffleOutline,IoPlaySkipForwardOutline } from 'react-icons/io5'
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import addToQueue from '../Functions/addToQueue'
import shuffule from '../Functions/shuffle'
import playNext from '../Functions/playNext'
import Cookies from 'js-cookie'
import { useNavigate, useParams } from 'react-router-dom';
const SongCard = ({image,title,id,channelName,setToastDisplay,setToastMsg}) => {

  // room id from params
  const {id: paramsId} = useParams();
  const nav = useNavigate()

  // room code
  const roomCode = paramsId || sessionStorage.getItem("roomCode");

  // local state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
    const {videoIds,currentPlaying,setIsPause}=useStateContext()
   
 const handlePlay=async()=>{
  try{

    const selectedSong = {
      title,id,image,channelName,playedBy:Cookies.get('name'),playedAt:Timestamp.now()
    }

    if(videoIds?.length>0){
      await updateDoc(doc(db,'room',roomCode),{currentSong:[...videoIds,selectedSong,],currentPlaying:selectedSong}).catch(err=>console.log(err))
    }else{
      await updateDoc(doc(db,'room',roomCode),{currentSong:[selectedSong],currentPlaying:selectedSong}).catch(err=>console.log(err))
    }
    setIsPause(false)
    nav(`/room/${encodeURI(roomCode)}/player`)
  }
    catch(err){
      if(!roomCode){
        setToastDisplay(true)
        setToastMsg('Join Room to play Songs')
        setTimeout(()=>setToastDisplay(false),4000)

      }
      console.log(err)
    }
  
 }
  return (

<div  className='flex flex-row p-2 px-1 pe-1 justify-center items-start gap-2 text-white cursor-pointer' >
  <img src={image} className='rounded-lg h-12 w-16' onClick={()=>handlePlay()} alt='' />
  <p className='w-2/3 line-clamp-2 text-sm' onClick={()=>handlePlay()}>{title}</p>
  <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={'down'}>
<DropdownToggle className='btn' tag={'button'} >
<IoEllipsisVertical color='white' size={18} />
</DropdownToggle>
<DropdownMenu className='bg-dark  dropdown-menu-end border-dark !hover:bg-zinc-800 !hover:text-slate-200  shadow-lg p-2'>
<DropdownItem className='d-flex gap-2 pt-3 pb-3 text-light text-xs dropwdown-item' onClick={()=>{
  playNext(image,title,id,channelName,videoIds,currentPlaying,Cookies.get('name'))
  setToastDisplay(true)
  setToastMsg('Added to Play next')
  setTimeout(()=>setToastDisplay(false),4000)
  }}>
<IoPlaySkipForwardOutline color='white' size={16} /> Play Next
</DropdownItem>
  <DropdownItem className='d-flex gap-2 pt-3 pb-3 text-light text-xs dropwdown-item' onClick={()=>{
    addToQueue(image,title,id,channelName,videoIds,Cookies.get('name'))
    setToastDisplay(true)
  setToastMsg('Added to Queue')
  setTimeout(()=>setToastDisplay(false),4000)
  }}>
  <HiOutlineQueueList color='white' size={16} />  Add to Queue
  </DropdownItem>
  <DropdownItem className='d-flex gap-2 pt-3 pb-3 text-light text-xs dropwdown-item' onClick={()=>{
    addToQueue(image,title,id,channelName,videoIds,Cookies.get('name'))
    setToastDisplay(true)
  setToastMsg('Added to Repeat')
  setTimeout(()=>setToastDisplay(false),4000)
  }}>
  <IoRepeatOutline color='white' size={16} />  Repeat
  </DropdownItem>
  <DropdownItem className='d-flex gap-2 pt-3 pb-3 text-light text-xs dropwdown-item' onClick={()=>{
    shuffule(image,title,id,channelName,videoIds,Cookies.get('name'))
    setToastDisplay(true)
  setToastMsg('Added to Shuffle')
  setTimeout(()=>setToastDisplay(false),4000)
  }}>
  <IoShuffleOutline color='white' size={16} />  Shuffle
  </DropdownItem>
</DropdownMenu>
    </Dropdown>
</div>
   
  )
}

export default SongCard