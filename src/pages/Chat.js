import React, { useEffect, useState } from 'react'
import {collection,getDoc,query,where,orderBy,onSnapshot,doc,getDocs, addDoc, Timestamp, updateDoc,} from 'firebase/firestore'
import Cookies from 'js-cookie'
import { db } from '../firebase-config'
import { BiTimeFive } from 'react-icons/bi'
import { GoChevronUp, GoPaperAirplane } from 'react-icons/go'
import { Link } from 'react-router-dom'
import { useStateContext } from '../Context/ContextProvider'
const Chat = () => {
    const {setNotification,messages,setMessages} = useStateContext()
    const [myMsg,setMyMsg]=useState('')
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      const handleScroll = () => {
        const scrollY = window.scrollY;
        setIsVisible(scrollY > 100);
      };
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
   useEffect(()=>{
    const updateRead=()=>{
        const unReadMsg = messages.filter(data=>data.status='unread' && data.name!==Cookies.get('name'))
        unReadMsg.map(data=> updateDoc(doc(db,'room',sessionStorage.getItem('roomCode'),'messages',data.id),{status:'read'}))
    }
    updateRead()
   },[])
    const scrollToElement = (id) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };
    const sendMsg=async()=>{
        await addDoc(collection(db,'room',sessionStorage.getItem('roomCode'),'messages'),{data:myMsg,sender:Cookies.get('name'),timestamp:Timestamp.now(),status:'unread'}).then(()=>{
            setMyMsg('')
        }).catch(err=>console.log(err))
    }
  return (<div className='bg-black'>
   <div className='text-white ml-5 text-xl flex  items-end' >
      <b>Chat</b>
      </div>
  <div className="flex gap-0 h-screen  overflow-hidden overflow-y-scroll w-screen  bg-black ">

    {
        sessionStorage.getItem('roomCode')?(
            <div className=' bg-zinc-900 w-screeen m-3  overflow-hidden overflow-y-scroll flex justify-center   rounded-lg text-sm '>
            <div className='flex flex-col justify-between w-screen gap-0'>
                  
                {
                    messages.map((data,index)=>(
                        (data.sender===Cookies.get('name'))?((index==messages.length-1)?(
                            <div className=''>

                        <div key={index} className=' chat chat-end  text-white  p-2 mb-28  '>
                            <div className=" bg-black chat-bubble ">
                            <b>{'You'}</b>
                        <p>{data.data}</p>
                        <div className='flex flex-row items-center  text-xs'>
                            <BiTimeFive /> {data.timestamp.toDate().getHours()+':'+data.timestamp.toDate().getMinutes()}
                                </div>
                            </div>
                        </div>
                        </div>
                        ):(
                            
                            <div key={index} className=' chat chat-end  text-white p-2 '>
                            <div className="bg-black chat-bubble ">
                            <b>{'You'}</b>
                        <p>{data.data}</p>
                        <div className='flex flex-row items-center text-xs'>
                            <BiTimeFive /> {data.timestamp.toDate().getHours()+':'+data.timestamp.toDate().getMinutes()}
                                </div>
                            </div>
                            </div>
                          
                        )
                            
                        ):((index===messages.length-1)?(
                            <div className="">
                            <div key={index} className=' chat chat-start start-0 text-white p-2 mb-28 '>
                            <div className="bg-black chat-bubble ">
                            <b>{data.sender}</b>
                        <p>{data.data}</p>
                        <div className='flex flex-row items-center text-xs'>
                            <BiTimeFive /> {data.timestamp.toDate().getHours()+':'+data.timestamp.toDate().getMinutes()}
                                </div>
                            </div>
                            </div>
                            </div>
                        ):(
                            <div key={index} className=' chat chat-start  text-white p-2 '>
                            <div className="bg-black chat-bubble">
                            <b>{data.sender}</b>
                        <p>{data.data}</p>
                        <div className='flex flex-row items-center text-xs'>
                            <BiTimeFive /> {data.timestamp.toDate().getHours()+':'+data.timestamp.toDate().getMinutes()}
                                </div>
                            </div>
                            </div>
                        )
                            
                        )
                       
                    ))
                }
                <button className={` bg-white bg-opacity-10 w-8 p-2  rounded-full backdrop-filter backdrop-blur fixed right-7 bottom-20 transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}` } onClick={()=>scrollToElement('top')} >
                <GoChevronUp className='mx-auto' color='white' size={15} />
                </button> 
            </div>
            <div className=' pt-5 flex flex-row fixed bottom-8 gap-2'>
            <input 
        type='text'
        className='bg-slate-50 h-10 w-56   rounded-full pl-5  outline-none '
        value={myMsg}
        onChange={(e)=>{
    setMyMsg(e.target.value)
        }} 
        placeholder='Type here...'
        />
        <button className='bg-slate-50 rounded-full  p-2 w-10  text-center ' onClick={()=>sendMsg()}>
            {/* <Icon path={mdiSend} size={1} /> */}
            <GoPaperAirplane className='mx-auto' color='black' size={18} />
        </button>
            </div>
        </div>
        ):(
            <div className='my-auto mx-auto text-white'>
                <p><b>Please join the room to chat </b></p>
            </div>
        )
    }
    </div>
  </div>
    
  )
}

export default Chat