import React,{useState} from 'react';
import ReactDOM from 'react-dom';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
  } from 'reactstrap';
  import Cookies from 'js-cookie';
  import { db } from '../firebase-config';
  import {setDoc ,doc,Timestamp} from 'firebase/firestore'
import { useStateContext } from '../Context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import { IoCopyOutline } from 'react-icons/io5';
import CopyToClipboard from 'react-copy-to-clipboard';
import '../App.css'
import { fontFamily } from '../constants';
function CreateRoom() {
    const nav = useNavigate()
    const [roomCode,setRoomCode]=useState('')
    const [msg,setMsg]=useState('')
  const {modal_backdrop,setmodal_backdrop}=useStateContext()
  const toggle = () => setmodal_backdrop(!modal_backdrop);
  const handleCreateRoom=async()=>{
    await setDoc(doc(db,'room',roomCode),{roomCode:roomCode,roomAdmin:Cookies.get('name'),roomMates:[
      {
        email:Cookies.get("email"),
        userName:Cookies.get("name"),photoUrl:Cookies.get("photoUrl"),joinedeAt:Timestamp.now()
      }
    ],createdAt:Timestamp.now(),adminEmail:Cookies.get("email"),isPrivate:true}).then(()=>{
        setMsg(`Please copy your room code ${roomCode}.`)
        sessionStorage.setItem('roomCode',roomCode)
        setTimeout(()=>{
            setmodal_backdrop(!modal_backdrop)
            nav(`/room/${encodeURI(roomCode)}/search`)
        },8000)
        
        
}).catch(err=>{
    setMsg(err)
    console.log(err)
})
  }
  const handleCopy=()=>{
    setMsg('Copied to clipboard')
  }

  return (
    <Modal centered={true} style={{fontFamily:fontFamily}} className='flex justify-center w-72 ' isOpen={modal_backdrop} toggle={toggle} unmountOnClose={true}>
    <ModalHeader className='!border-none' toggle={toggle}><b>Create a new room</b></ModalHeader>
    <ModalBody>
      {
        msg &&(
          <h6 className='m-3 test-start'><b>Here's the link</b></h6>
        )
      }
      <Input
        type="text"
        value={roomCode}
        onChange={(e)=>setRoomCode(e.target.value)}
        placeholder="Enter your room code..."
      />
  
      <div className='flex items-center'>
      {
        msg && (
          <CopyToClipboard text={roomCode} onCopy={handleCopy} >
          <IoCopyOutline className='-ml-6 cursor-pointer' color='gray' />
          </CopyToClipboard>
        )
      }
      </div>
      <p className=' m-3 mt-6 text-start' id='msg'>{msg}</p>
    </ModalBody>
    
    <ModalFooter className='!border-none'>
      {
        msg ?(<Button color="dark" onClick={toggle}>
        Done
      </Button>):(<>
         <Button color="dark" onClick={()=>handleCreateRoom()}>
        Create
      </Button>{' '}
      <Button color="" onClick={toggle}>
        Cancel
      </Button></>)
      }
     
    </ModalFooter>
  </Modal>
  );
}
export default CreateRoom