import React,{useState} from 'react';
import ReactDOM from 'react-dom';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Label,
    Form,
    FormGroup,
  } from 'reactstrap';
  import Cookies from 'js-cookie';
  import { db } from '../firebase-config';
  import {setDoc , collection,doc} from 'firebase/firestore'
import { useStateContext } from '../Context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import { IoCopyOutline } from 'react-icons/io5';
import CopyToClipboard from 'react-copy-to-clipboard';
import '../App.css'
function CreateRoom() {
    const nav = useNavigate()
    const [roomCode,setRoomCode]=useState('')
    const [msg,setMsg]=useState('')
  const {modal_backdrop,setmodal_backdrop}=useStateContext()
  const [unmountOnClose, setUnmountOnClose] = useState(true);
  const [copy,setCopy] = useState(false)
  const toggle = () => setmodal_backdrop(!modal_backdrop);
  const handleCreateRoom=async()=>{
    const collectionRef=collection(db,'room')
    await setDoc(doc(db,'room',roomCode),{roomCode:roomCode,roomAdmin:Cookies.get('name'),members:[]}).then(()=>{
        setMsg(`Please copy your room code ${roomCode}.`)
        sessionStorage.setItem('roomCode',roomCode)
        setTimeout(()=>{
            setmodal_backdrop(!modal_backdrop)
            nav('/search')
        },8000)
        
        
}).catch(err=>{
    setMsg(err)
    console.log(err)
})
  }
  const handleCopy=()=>{
    setCopy(true)
    setMsg('Copied to clipboard')
    setTimeout(()=>{setCopy(false)},4000)
  }

  return (
    <Modal centered={true} className='flex justify-center w-72 ' isOpen={modal_backdrop} toggle={toggle} unmountOnClose={unmountOnClose}>
    <ModalHeader  toggle={toggle}><b>Create a new room</b></ModalHeader>
    <ModalBody>
      {
        msg &&(
          <h6 className='m-3 test-start'><b>Here's the link</b></h6>
        )
      }
      <div className='flex flex-row items-center'>
      <Input
        type="text"
        value={roomCode}
        onChange={(e)=>setRoomCode(e.target.value)}
        placeholder="Enter your room code..."
      />
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
    
    <ModalFooter>
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