import React from 'react'
import Icon from '@mdi/react';
import logo from '../assests/logo.png'
import { mdiHomeVariant, mdiMagnify, mdiMessageOutline } from '@mdi/js';
import { db } from '../firebase-config';
import { addDoc ,getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
const Sidebar = () => {
  return (
    <React.Fragment>
      <div className='bg-zinc-900'>
        <div className='flex flex-row  text-white ml-5 pt-2'>
        <img  src={logo} height={45} width={45} className='' /> <b className='mt-2'>SyncTunes</b>
        </div>
           
        <div className='bg-zinc-900 flex flex-row justify-around p-3'>
        
        <Link to={'/home'}>
       
        <Icon path={mdiHomeVariant} color={'white'} size={1} />
        </Link>
        <Link to={'/search'}>
         
          <Icon path={mdiMagnify} color={'white'} size={1} />
        </Link>
        <Link to={'/chat'}>
          
          <Icon path={mdiMessageOutline} color={'white'} size={1} />
        </Link>
        </div>
      </div>
       
    </React.Fragment>
  )
}

export default Sidebar