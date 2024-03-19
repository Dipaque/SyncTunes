import React,{useState} from 'react'
import Icon from '@mdi/react';
import logo from '../assests/logo.png'
import { BiPowerOff } from "react-icons/bi";
import { mdiHomeVariant, mdiHomeVariantOutline, mdiMagnify, mdiMessageOutline ,mdiAccountCircleOutline} from '@mdi/js';
import { auth } from '../firebase-config';
import { addDoc ,getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { mdiPowerOff } from '@mdi/js';
import { GoHome, GoSearch, GoCommentDiscussion } from "react-icons/go";
import { useStateContext } from '../Context/ContextProvider';
import { RxMagnifyingGlass } from 'react-icons/rx'
const Sidebar = () => {
  const nav = useNavigate()
  const {path,setPathName,notification}=useStateContext()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const signOutUser=()=>{
    signOut(auth).then(() => {
      setPathName('/')
      nav('/')
    }).catch((error) => {
      console.log(error)
    });
  }
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  return (
    <React.Fragment>
      <div className='bg-zinc-900'>
        <div className='flex flex-row  text-white ml-5 pt-2'>
        <img  src={logo} height={10} width={20} className='' /> <b className='mt-2 ml-2'>SyncTunes</b>
        </div>
<         div className='bg-zinc-900 flex flex-row justify-around p-3 items-center'>
        
            <Link to={'/home'}>
              <GoHome size={25} color='white' />
            </Link>
            <Link to={'/search'}  >
            <RxMagnifyingGlass color='white' size={25} />
            {/* <GoSearch size={25} color='white' /> */}
            </Link>
            <Link to={'/chat'}>
           {
            notification > 0 && <div className="badge  bg-white text-black badge-full  absolute ml-4 -mt-4">{notification}</div>
           } 
            <GoCommentDiscussion size={25} color='white' />
            </Link>
            {
              Cookies.get('photoUrl') ? ( 
                <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={'down'}>
                  <DropdownToggle className=' btn' tag={'button'}>
                  <img src={Cookies.get('photoUrl')} className='rounded-full h-7' />
                  </DropdownToggle>
                  <DropdownMenu className='dropdown-menu-end bg-dark' >
                    <DropdownItem className='bg-dark text-sm text-white d-flex justify-center items-center gap-1' onClick={()=>signOutUser()}>
                        Log out <BiPowerOff color='white'  size={ 16} />
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ):<Icon className='' path={mdiAccountCircleOutline} color={'white'} size={1.4} />
            }
          
            </div>
      </div>
       
    </React.Fragment>
  )
}

export default Sidebar