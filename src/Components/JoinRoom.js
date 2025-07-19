import React,{useState} from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
  } from 'reactstrap';
  import { db } from '../firebase-config';
  import {collection,doc,getDoc, updateDoc} from 'firebase/firestore'
import { useStateContext } from '../Context/ContextProvider';
import Cookies from 'js-cookie';
import { fontFamily } from '../constants';
function JoinRoom() {
    const [roomCode,setRoomCode]=useState('')
    const [msg,setMsg]=useState('')
  const {modal_backdrop1,setmodal_backdrop1,setJoineeSong}=useStateContext()
  const [unmountOnClose, setUnmountOnClose] = useState(true);

  const toggle = () => setmodal_backdrop1(!modal_backdrop1);
  const handleJoinRoom=async()=>{
    const collectionRef=collection(db,'room')
   const data= await getDoc(doc(db,'room',roomCode))
   if(data.exists()){
    sessionStorage.setItem('roomCode',roomCode)
    setJoineeSong(data.data().currentSong)
    const members=data.data().members
    if(!members.includes(Cookies.get('name'))){
      await updateDoc(doc(db,'room',roomCode),{members:[...data.data().members,Cookies.get('name')]})
    }
   setmodal_backdrop1(!modal_backdrop1)
   }else{
    setMsg('Room code is incorrect')
   }
  }

  return (
    <Modal centered={true} className='flex justify-center w-72' style={{fontFamily:fontFamily}} isOpen={modal_backdrop1} toggle={toggle} unmountOnClose={unmountOnClose}>
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