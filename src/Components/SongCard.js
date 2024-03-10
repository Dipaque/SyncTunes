import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStateContext } from '../Context/ContextProvider'
import { db } from '../firebase-config'
import { addDoc,collection, doc, updateDoc } from 'firebase/firestore'
import Icon from '@mdi/react'
import { mdiPlay } from '@mdi/js'
const SongCard = ({image,title,id}) => {
    const {setVideoId}=useStateContext()
    const nav=useNavigate()
 const handlePlay=async()=>{
  setVideoId(id)
await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:id}).catch(err=>console.log(err))
 
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
  <div class="p-6 pt-0">
    <button
      class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs p-3 rounded-full bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
      type="button" onClick={()=>handlePlay()}>
      <Icon path={mdiPlay} size={1} />
    </button>
  </div>
</div>
    </div>
   
  )
}

export default SongCard