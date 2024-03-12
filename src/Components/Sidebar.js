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
import { useStateContext } from '../Context/ContextProvider';
const Sidebar = () => {
  const nav = useNavigate()
  const {setPathName}=useStateContext()
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
           
            <Icon path={mdiHomeVariantOutline} color={'white'} size={1} />
            </Link>
            <Link to={'/search'} >
             
              <Icon path={mdiMagnify} color={'white'} size={1} />
            </Link>
            <Link to={'/chat'}>
              
              <Icon path={mdiMessageOutline} color={'white'} size={1} />
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