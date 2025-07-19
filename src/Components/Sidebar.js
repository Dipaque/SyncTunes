import React,{useEffect } from 'react'
import Cookies from 'js-cookie';
import { IoChatbox, IoChatboxOutline } from "react-icons/io5";
import { Link, } from 'react-router-dom';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { GoHome, GoHomeFill, GoPerson } from "react-icons/go";
import { useStateContext } from '../Context/ContextProvider';
import { RxMagnifyingGlass } from 'react-icons/rx'
const Sidebar = () => {
  const {pathName,setPathName,notification}=useStateContext()
  const roomCode = sessionStorage.getItem("roomCode");
  useEffect(()=>{
    const getPathName=()=>{
      setPathName(window.location.pathname)
    }
    getPathName()
  },[window.location.pathname])
  return (
    <React.Fragment>
     <div className="bg-zinc-900/50 backdrop-blur-md border-t border-white/10 rounded-bl-xl rounded-br-xl  w-full z-50">
  <div className="flex flex-row justify-between p-3 items-center">
    <Link to="/home">
      {pathName.includes('home') ? (
        <GoHomeFill size={25} color="white" />
      ) : (
        <GoHome size={25} color="white" />
      )}
    </Link>

    <Link to="/search">
      {!pathName.includes('search') ? (
        <RxMagnifyingGlass color="white" size={25} />
      ) : (
        <FaMagnifyingGlass color="white" size={20} />
      )}
    </Link>

  { roomCode &&  <Link to="/chat" className="relative">
      {notification > 0 && (
        <div className="badge bg-white text-black absolute -top-2 left-4 text-xs px-1.5 py-0.5 rounded-full">
          {notification}
        </div>
      )}
      {pathName.includes('chat') ? (
        <IoChatbox size={25} color="white" />
      ) : (
        <IoChatboxOutline size={25} color="white" />
      )}
    </Link>}

    <Link to="/profile">
      {Cookies.get('photoUrl') ? (
        <img
          src={Cookies.get('photoUrl')}
          className="rounded-full h-7 w-7 object-cover"
          alt="profile"
        />
      ) : (
        <GoPerson color="white" size={25} />
      )}
    </Link>
  </div>
</div>

       
    </React.Fragment>
  )
}

export default Sidebar