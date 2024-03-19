import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db,auth } from '../firebase-config'
import { signOut } from 'firebase/auth';
import { GoBookmarkFill, GoSignOut } from 'react-icons/go'
import { useStateContext } from '../Context/ContextProvider'
import { useNavigate } from 'react-router-dom'
const Profile = () => {
  const nav = useNavigate()
  const [myRoom,setMyRoom]=useState([])
  const {path,setPathName,}=useStateContext()
  const signOutUser=()=>{
    signOut(auth).then(() => {
      setPathName('/')
      nav('/')
    }).catch((error) => {
      console.log(error)
    });
  }
  useEffect(()=>{
    const getData=async()=>{
      const filteredQuery = query(collection(db,'room'),where('roomAdmin','==',Cookies.get('name')))
      const data = await getDocs(filteredQuery)
     setMyRoom(data.docs.map((doc)=>({ ...doc.data(), id: doc.id })))
    }
    getData()
  },[])
  return (
    <div className='flex gap-0 bg-black flex-col'>
        <div className='text-white ml-8 text-xl flex justify-start  items-end   '>
        <b>Profile</b>
      </div>
      <div className="flex justify-center mt-8">
        <div className='flex flex-col  gap-2 text-lg  text-slate-100'>
      <img src={Cookies.get('photoUrl')} className='rounded-full h-20 w-20 mx-auto' />
      <p className='mx-auto text-sm'>{Cookies.get('name')}</p>
      <p className='mx-auto text-sm'>{Cookies.get('email')}</p>
      {
        sessionStorage.getItem('roomCode') ? (<p className='mx-auto text-sm'>{'Current Room : '+sessionStorage.getItem('roomCode')}</p>):(<p className='mx-auto text-sm'>{'No room joined'}</p>)
      }
      
      </div>
      </div>
      <div className='text-white ml-8 text-lg flex flex-col justify-start  items-start'>
        <b>
          My Rooms
        </b>
        <div className="text-sm mt-2  bg-black text-slate-200 list-none overflow-hidden overflow-y-scroll h-28">
          
          {
            myRoom.length>0 ?(
              
                myRoom.map((data)=>(
                  <div className='p-1 flex flex-row gap-1'>
                    
                   <GoBookmarkFill color='white' size={14} />
                   {
                    data.roomCode
                   }    
                  </div>
                ))
              
            ) :(
              <div className='mx-auto mt-5 text-slate-100'>
                No rooms created yet!
                </div>
            )
           
          }
        </div>
        <button className='text-slate-50 flex flex-row-reverse gap-2 mt-5 mb-5 items-center justify-start text-sm' onClick={()=>signOutUser()}>
          <GoSignOut color='white' size={16}  />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default Profile