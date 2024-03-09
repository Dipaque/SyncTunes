import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Icon from '@mdi/react'
import { mdiSend } from '@mdi/js'
import {collection,getDoc,query,where,orderBy,onSnapshot,doc,getDocs, addDoc, Timestamp,} from 'firebase/firestore'
import Cookies from 'js-cookie'
import { db } from '../firebase-config'
const Chat = () => {
    const [messages,setMessages]=useState([])
    const [myMsg,setMyMsg]=useState('')
    useEffect(()=>{
        const getData=()=>{
            if(sessionStorage.getItem('roomCode')){
                const filteredUsersQuery = query(collection(db,'room',sessionStorage.getItem('roomCode'),'messages'),orderBy('timestamp','asc'));
                onSnapshot(filteredUsersQuery,((data) => {
                  setMessages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
                }))
            }
        }
        getData()
        
    },[])
    const sendMsg=async()=>{
        await addDoc(collection(db,'room',sessionStorage.getItem('roomCode'),'messages'),{data:myMsg,sender:Cookies.get('name'),timestamp:Timestamp.now()}).then(()=>{
            setMyMsg('')
        }).catch(err=>console.log(err))
    }
  return (<>
  <Sidebar />
  <div className="flex gap-0 h-screen  w-screen  bg-black ">
    {
        sessionStorage.getItem('roomCode')?(
            <div className=' bg-zinc-900 w-screen overflow-hidden overflow-y-scroll  flex justify-center  mt-3 mb-3 rounded-lg  mr-6'>
            <div className='flex flex-col '>
                {
                    messages.map((data,index)=>(
                        (data.sender===Cookies.get('name'))?((index==messages.length-1)?(<div className='block'>
                        <div key={index} className='bg-black  rounded-lg text-white  w-52 p-3
                        ml-40 mt-3 mb-32  '>
                        <b>{'You'}</b>
                        <p>{data.data}</p>
                        </div>
                        </div>):(
                            <div className='block'>
                            <div key={index} className='bg-black  rounded-lg text-white  w-52 p-3
                            ml-40 mt-3 '>
                            <b>{'You'}</b>
                            <p>{data.data}</p>
                            </div>
                            </div>
                        )
                            
                        ):((index===messages.length-1)?(
                            <div className='block'>
                            <div key={index} className='bg-black  rounded-lg text-white  w-52 p-3 ms-3 mt-3  mb-32'>
                            <b>{data.sender}</b>
                            <p>{data.data}</p>
                            </div>
                            </div>
                        ):(
                            <div className='block'>
                            <div key={index} className='bg-black  rounded-lg text-white  w-52 p-3 ms-3 mt-3  '>
                            <b>{data.sender}</b>
                            <p>{data.data}</p>
                            </div>
                            </div>
                        )
                            
                        )
                       
                    ))
                }
            </div>
            <div className=' pt-5 flex flex-row justify-center-center gap-2'>
            <input 
        type='text'
        className='bg-slate-50 h-10 w-56   rounded-full pl-5 fixed right-28 bottom-8 ml-5 '
        value={myMsg}
        onChange={(e)=>{
    setMyMsg(e.target.value)
        }} 
        placeholder='Type here...'
        />
        <button className='bg-slate-50 rounded-full fixed bottom-8 p-2 right-9 text-center' onClick={()=>sendMsg()}>
            <Icon path={mdiSend} size={1} />
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
  </>
    
  )
}

export default Chat