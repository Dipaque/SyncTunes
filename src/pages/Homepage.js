import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar';
import Cookies from 'js-cookie';
import YouTubeVideo from '../Components/YoutubeVideo';
import { useStateContext } from '../Context/ContextProvider';
import { db, auth } from '../firebase-config';
import CreateRoom from '../Components/CreateRoom';
import JoinRoom from '../Components/JoinRoom';
import { useNavigate } from 'react-router-dom';
import { collection, query, where,  onSnapshot, doc, getDocs, updateDoc, } from 'firebase/firestore'
import LeaveRoom from '../Components/LeaveRoom';
import { IoBookmarksOutline, } from 'react-icons/io5';
const Homepage = () => {
  const nav = useNavigate()
  const [currentSong, setCurrentSong,] = useState([])
  const {  setVideoIds, setIsLeaving, isLeaving, playedBy } = useStateContext()
  const [song, setSong] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roomMate, setRoomMate] = useState([])
  const [admin, setAdmin] = useState('')
  const signOut = () => {
    signOut(auth).then(() => {
      nav('/')
    }).catch((error) => {
      console.log(error)
    });
  }
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  useEffect(() => {
    const getData = () => {
      if (sessionStorage.getItem('roomCode')) {
        const filteredUsersQuery = query(collection(db, 'room'), where('roomCode', '==', sessionStorage.getItem('roomCode')));
        onSnapshot(filteredUsersQuery, ((data) => {
          setCurrentSong(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
          setVideoIds(data.docs[0].data().currentSong)
          setRoomMate(data.docs[0].data().members)
          setAdmin(data.docs[0].data().roomAdmin)
        }))
      }
    }
    getData()
  }, [sessionStorage.getItem('roomCode')])
  // Check if the browser supports the Notification API
  if ('Notification' in window) {
    // Check if permission has not been granted previously
    if (Notification.permission !== 'granted') {
      // Ask for permission
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
        }
      });
    }
  }
  const handleLeaveRoom = async () => {
    if (roomMate.length > 0) {

      const index = roomMate.indexOf(Cookies.get('name'))
      if (index > -1) {
        roomMate.splice(index, 1)
      }
      await updateDoc(doc(db, 'room', sessionStorage.getItem('roomCode')), { members: roomMate })
    } setCurrentSong([])
    sessionStorage.removeItem('roomCode')
    setIsLeaving(!isLeaving)
  }
  return (
    <>
      <Sidebar />
      <div className="flex justify-center gap-0 h-full  w-screen  bg-black " id='top'>
        <CreateRoom />
        <JoinRoom />
        <LeaveRoom handleLeaveRoom={handleLeaveRoom} />
        <div className=' m-3 mb-5  rounded-lg w-96 ' >
          {
            Cookies.get('name') && ( <div className='text-white  mt-3 text-lg ml-3 flex justify-start  items-center   '>
            <b className=' '>{'Welcome ' + Cookies.get('name').split(' ')[0]||Cookies.get('name') }</b>
          </div>)
          }
          {
            sessionStorage.getItem('roomCode') && currentSong.length > 0 && (<div className=' flex items-center  justify-center flex-col  '>
              {
                admin && (<p className='text-sm text-slate-50  mt-2'>Created by {admin.split(' ')[0]|| admin}</p>)
              }
              <button className=' mx-auto  text-sm   text-white flex flex-row justify-center items-center gap-2'
                type='button'
                onClick={() => setIsLeaving(true)}>
                <IoBookmarksOutline color='white' size={16} />{sessionStorage.getItem('roomCode')}
              </button>
              {
                playedBy && (<p className='text-sm text-slate-50  mt-2'>Played by {playedBy.split(' ')[0]||playedBy}</p>)
              }
              {
                <YouTubeVideo videoIds={currentSong[0].currentSong} />
              }
            </div>)
          }
        </div>
      </div>
    </>
  )
}
export default Homepage