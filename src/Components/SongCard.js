import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useStateContext } from '../Context/ContextProvider'
import { db } from '../firebase-config'
import {  doc, updateDoc } from 'firebase/firestore'
import Icon from '@mdi/react'
import { HiOutlineQueueList, HiOutlineHeart } from "react-icons/hi2";
import { IoEllipsisVertical, IoPlay, IoRepeatOutline, IoShuffleOutline,IoPlaySkipForwardOutline } from 'react-icons/io5'
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import addToQueue from '../Functions/addToQueue'
import shuffule from '../Functions/shuffle'
import playNext from '../Functions/playNext'
const SongCard = ({image,title,id,}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
    const {setVideoId,videoIds}=useStateContext()
    const nav=useNavigate()
   
 const handlePlay=async()=>{
  if(videoIds){
    await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[id,...videoIds],currentPlaying:id}).catch(err=>console.log(err))
  }else{
    await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[id],currentPlaying:id}).catch(err=>console.log(err))
  }
 }
  return (
    <div className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4'>
  <div class=" flex  flex-col mt-6 text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-72">
  <div
    class="relative h-32 mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-blue-gray-500/40">
    <img
      src={image}
      alt="card-image" />
  </div>
  <div class="p-3">
    <h5 class="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
      {title}
    </h5>
  </div>
  <div class="p-6 pt-0 flex  gap-36  flex-row items-center">
    
    <button
      class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs p-3 rounded-full bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
      type="button" onClick={()=>handlePlay()}>
      <IoPlay color='white'size={12} />
    </button>
    <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={'up'}>
<DropdownToggle className='btn' tag={'button'} >
<IoEllipsisVertical color='black' size={22} />
</DropdownToggle>
<DropdownMenu className='bg-white text-xs dropdown-menu-end border-white shadow-lg p-2'>
<DropdownItem className='d-flex gap-2 pt-3 pb-3' onClick={()=>playNext(id,videoIds)}>
<IoPlaySkipForwardOutline /> Play Next
</DropdownItem>
  <DropdownItem className='d-flex gap-2 pt-3 pb-3' onClick={()=>addToQueue(id,videoIds)}>
  <HiOutlineQueueList color='black' size={16} />  Add to Queue
  </DropdownItem>
  <DropdownItem className='d-flex gap-2 pt-3 pb-3' onClick={()=>addToQueue(id,videoIds)}>
  <IoRepeatOutline color='black' size={16} />  Repeat
  </DropdownItem>
  <DropdownItem className='d-flex gap-2 pt-3 pb-3' onClick={()=>shuffule(id,videoIds)}>
  <IoShuffleOutline color='black' size={16} />  Shuffle
  </DropdownItem>
</DropdownMenu>
    </Dropdown>
   
  </div>
</div>
    </div>
   
  )
}

export default SongCard