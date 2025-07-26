import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db,auth } from '../firebase-config'
import { signOut } from 'firebase/auth';
import { useStateContext } from '../Context/ContextProvider'
import { Link, useNavigate } from 'react-router-dom'
import { IoBookmarksOutline } from 'react-icons/io5';
const Profile = () => {
  const nav = useNavigate()
  const [myRoom,setMyRoom]=useState([])
  const {path,setPathName,  handleClear, setCurrentSong, setIsPause, setThumbnail}=useStateContext()
  const signOutUser=()=>{
    signOut(auth).then(() => {
      setPathName('/')
      Cookies.remove('name')
      Cookies.remove('email')
      Cookies.remove('phone')
      Cookies.remove('photoUrl')
      Cookies.remove('uid')
      sessionStorage.removeItem("roomCode");
      setCurrentSong([]);
      setIsPause(true)
      setThumbnail("")
      handleClear()
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
    <div className='flex gap-0 bg-black flex-col mt-3 max-h-[calc(100vh-160)] overflow-y-auto'>
        <div className='text-white ml-8 text-xl flex justify-start  items-end   '>
        <b>Profile</b>
      </div>
      <div className="flex justify-center mt-3">
        <div className='flex flex-col  gap-2 text-lg  text-slate-100'>
      <img src={Cookies.get('photoUrl')} className='rounded-full h-20 w-20 mx-auto' alt='profile' />
      <p className='mx-auto text-sm'>{Cookies.get('name')}</p>
      {
        sessionStorage.getItem('roomCode') ? (<p className='mx-auto text-sm'>{'Current Room : '+sessionStorage.getItem('roomCode')}</p>):(<p className='mx-auto text-sm'>{'No room joined'}</p>)
      }
      </div>
      </div>
      <div className='text-white ml-8 text-lg flex flex-col justify-start  items-start'>
        <div>
        <b>
          My Rooms
        </b>
        <div className="text-sm mt-2 h-28  bg-black text-slate-200 list-none overflow-hidden overflow-y-auto xs:w-72 lg:w-screen ">  
          {
            myRoom.length>0 ?(
              
                myRoom.map((data,i)=>(
                  <div className='p-1 flex flex-row items-center gap-1' key={`key-${i}`}>
                    
                   <IoBookmarksOutline color='white' size={14} />
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
        </div>
        <div className='mt-4 mb-16 flex flex-col justify-end items-start gap-3 '>
          <h6><b>Others</b></h6>
          <Link to={'/third-party'} className='no-underline'>
          <button className='text-slate-50 flex flex-row-reverse gap-2   items-center justify-start text-sm'>
          Third-party Software
        </button>
        </Link>
          <Link to={'/privacy-policy'} className='no-underline'>
        <button className='text-slate-50 flex flex-row-reverse gap-2   items-center justify-start text-sm'>
          Privacy Policy
        </button>
        </Link>
        <Link to={'/terms'} className='no-underline'>
        <button className='text-slate-50 flex flex-row-reverse gap-2  items-center justify-start text-sm '>
          Terms and Conditions
        </button>
        </Link>
        <span className='text-slate-50 text-sm'>
          Version <br />
          <span className='text-zinc-700'>2.0.1</span>
        </span>
        <button className='text-slate-50 flex flex-row-reverse gap-2  items-center justify-start text-sm' onClick={()=>signOutUser()}>
          Log out
        </button>
        </div>
      </div>
    </div>
  )
}

export default Profile