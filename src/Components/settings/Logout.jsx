import React from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth';
import Cookies from 'js-cookie'
import { useStateContext } from '../../Context/ContextProvider';
import { auth } from '../../firebase-config';

const Logout = () => {
    const nav = useNavigate()
    const {setPathName,  handleClear, setCurrentSong, setIsPause, setThumbnail}=useStateContext()

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
  return (
    <button className='bg-slate-50 rounded-full p-2 flex gap-2  items-center justify-center text-sm w-24 mx-auto mt-5' onClick={()=>signOutUser()}>
    Log out
  </button>
  )
}

export default Logout