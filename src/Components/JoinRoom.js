import React,{useState, useEffect} from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
  } from 'reactstrap';
  import { db } from '../firebase-config';
  import {doc,getDoc, updateDoc, Timestamp} from 'firebase/firestore'
import { useStateContext } from '../Context/ContextProvider';
import Cookies from 'js-cookie';
import { fontFamily } from '../constants';
import { useNavigate } from 'react-router-dom';
function JoinRoom({codeViaProps}) {
  const nav = useNavigate();
    const [roomCode,setRoomCode]=useState('')
    const [msg,setMsg]=useState('')
    const {modal_backdrop1,setmodal_backdrop1,setJoineeSong}=useStateContext()
    const email = Cookies.get("email");

    useEffect(()=>{
      if(codeViaProps) setRoomCode(codeViaProps);
    },[codeViaProps])

  const toggle = () => setmodal_backdrop1(!modal_backdrop1);
  const handleJoinRoom=async()=>{
   const data= await getDoc(doc(db,'room',roomCode))
   if(data.exists()){
    sessionStorage.setItem('roomCode',roomCode)
    setJoineeSong(data.data().currentSong)
    const roomMates = data.data().roomMates||[]
    const isPresent = roomMates.some((user)=> user.email===email)
    if(!isPresent){
      await updateDoc(doc(db,'room',roomCode),{roomMates:[...roomMates,{email:Cookies.get("email"),userName:Cookies.get("name"),photoUrl:Cookies.get("photoUrl"),joinedeAt:Timestamp.now()}]})
    }
    nav(`/room/${roomCode}/player`)
   setmodal_backdrop1(!modal_backdrop1)
   }else{
    setMsg('Room code is incorrect')
   }
  }

  return (
    <Modal centered={true} className='flex justify-center w-72' style={{fontFamily:fontFamily}} isOpen={modal_backdrop1} toggle={toggle} unmountOnClose={true}>
    <ModalHeader className='!border-none' toggle={toggle}><b>Join the room</b></ModalHeader>
    <ModalBody>
      <Input
        type="text"
        value={roomCode}
        onChange={(e)=>setRoomCode(e.target.value)}
        placeholder="Enter your room code..."
      />
      <p className='text-red-600 text-center mt-3' id='msg'>{msg}</p>
    </ModalBody>
    <ModalFooter className='!border-none'>
      <Button color="dark" onClick={()=>handleJoinRoom()}>
        Join
      </Button>{' '}
      <Button color="" onClick={toggle}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
  );
}
export default JoinRoom