import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useStateContext } from '../Context/ContextProvider'
import { db } from '../firebase-config'
import {  doc, Timestamp, updateDoc } from 'firebase/firestore'
import { HiOutlineQueueList, HiOutlineHeart } from "react-icons/hi2";
import { IoEllipsisVertical, IoPlay, IoRepeatOutline, IoShuffleOutline,IoPlaySkipForwardOutline } from 'react-icons/io5'
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import addToQueue from '../Functions/addToQueue'
import shuffule from '../Functions/shuffle'
import playNext from '../Functions/playNext'
import Cookies from 'js-cookie'
const SongCard = ({image,title,id,channelName,setToastDisplay,setToastMsg}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
    const {videoIds,currentPlaying}=useStateContext()
   
 const handlePlay=async()=>{
  if(videoIds?.length>0){
    await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[...videoIds,{title,id,image,channelName,playedBy:Cookies.get('name'),playedAt:Timestamp.now()},],currentPlaying:{title,id,image,channelName,playedBy:Cookies.get('name'),playedAt:Timestamp.now()}}).catch(err=>console.log(err))
  }else{
    await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[{title,id,image,channelName,playedBy:Cookies.get('name'),playedAt:Timestamp.now()}],currentPlaying:{title,id,image,channelName,playedBy:Cookies.get('name'),playedAt:Timestamp.now()}}).catch(err=>console.log(err))
  }
 }
  return (

<div  className='flex flex-row m-3 justify-center items-start gap-2 text-white cursor-pointer' >
  <img src={image} className='rounded-lg h-16 w-16' onClick={()=>handlePlay()} alt='' />
  <p className='w-2/3 line-clamp-2' onClick={()=>handlePlay()}>{title}</p>
  <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={'down'}>
<DropdownToggle className='btn' tag={'button'} >
<IoEllipsisVertical color='white' size={18} />
</DropdownToggle>
<DropdownMenu className='bg-dark  dropdown-menu-end border-dark   shadow-lg p-2'>
<DropdownItem className='d-flex gap-2 pt-2 pb-2 text-light text-xs dropwdown-item' onClick={()=>{
  playNext(image,title,id,channelName,videoIds,currentPlaying,Cookies.get('name'))
  setToastDisplay(true)
  setToastMsg('Added to Play next')
  setTimeout(()=>setToastDisplay(false),4000)
  }}>
<IoPlaySkipForwardOutline color='white' size={16} /> Play Next
</DropdownItem>
  <DropdownItem className='d-flex gap-2 pt-2 pb-2 text-light text-xs dropwdown-item' onClick={()=>{
    addToQueue(image,title,id,channelName,videoIds,Cookies.get('name'))
    setToastDisplay(true)
  setToastMsg('Added to Queue')
  setTimeout(()=>setToastDisplay(false),4000)
  }}>
  <HiOutlineQueueList color='white' size={16} />  Add to Queue
  </DropdownItem>
  <DropdownItem className='d-flex gap-2 pt-2 pb-2 text-light text-xs dropwdown-item' onClick={()=>{
    addToQueue(image,title,id,channelName,videoIds,Cookies.get('name'))
    setToastDisplay(true)
  setToastMsg('Added to Repeat')
  setTimeout(()=>setToastDisplay(false),4000)
  }}>
  <IoRepeatOutline color='white' size={16} />  Repeat
  </DropdownItem>
  <DropdownItem className='d-flex gap-2 pt-2 pb-2 text-light text-xs dropwdown-item' onClick={()=>{
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