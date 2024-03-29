import React,{useEffect, useState} from 'react'
import Icon from '@mdi/react';
import logo from '../assests/logo.png'
import { BiPowerOff } from "react-icons/bi";
import { mdiAccountCircleOutline} from '@mdi/js';
import Cookies from 'js-cookie';
import { IoChatbox, IoChatboxOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { GoHome, GoSearch, GoCommentDiscussion, GoHomeFill, GoPerson } from "react-icons/go";
import { useStateContext } from '../Context/ContextProvider';
import { RxMagnifyingGlass } from 'react-icons/rx'
const Sidebar = () => {
  const nav = useNavigate()
  const {pathName,setPathName,notification}=useStateContext()
  useEffect(()=>{
    const getPathName=()=>{
      setPathName(window.location.pathname)
    }
    getPathName()
  },[window.location.pathname])
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  return (
    <React.Fragment>
      <div className='bg-zinc-900'>
        <div className='flex flex-row  text-white ml-5 pt-2'>
        <img  src={logo} height={10} width={20} className='' /> <b className='mt-2 ml-2'>SyncTunes</b>
        </div>
<         div className='bg-zinc-900 flex flex-row justify-around p-3 items-center'>
        
            <Link to={'/home'}>
              {
                pathName.includes('home') ?(<GoHomeFill size={25} color='white' />):(<GoHome size={25} color='white' />)
              }
              
            </Link>
            <Link to={'/search'}  >
              {
                !pathName.includes('search')?(<RxMagnifyingGlass color='white' size={25} />):(<FaMagnifyingGlass color='white' size={20} />)
              }
            
            {/* <GoSearch size={25} color='white' /> */}
            </Link>
            <Link to={'/chat'}>
           {
            notification > 0 && <div className="badge  bg-white text-black badge-full  absolute ml-4 -mt-4">{notification}</div>
           } 
           {
              pathName.includes('chat')?(<IoChatbox size={25} color='white' />) : (<IoChatboxOutline size={25} color='white' />)
           }
            </Link>
            <Link to={'/profile'}>
            {
              Cookies.get('photoUrl') ? ( 
             
                  <img src={Cookies.get('photoUrl')} className='rounded-full h-7' />
                 
              ):<GoPerson color='white' size={25} />
            }
            </Link>
            </div>
      </div>
       
    </React.Fragment>
  )
}

export default Sidebar