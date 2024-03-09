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
function CreateRoom() {
    const nav = useNavigate()
    const [roomCode,setRoomCode]=useState('')
    const [msg,setMsg]=useState('')
  const {modal_backdrop,setmodal_backdrop}=useStateContext()
  const [unmountOnClose, setUnmountOnClose] = useState(true);

  const toggle = () => setmodal_backdrop(!modal_backdrop);
  const handleCreateRoom=async()=>{
    const collectionRef=collection(db,'room')
    await setDoc(doc(db,'room',roomCode),{roomCode:roomCode,roomAdmin:Cookies.get('name'),members:[]}).then(()=>{
        setMsg(`Room created successfully and please copy your room code ${roomCode}. `)
        // console.log('added successfully')
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

  return (
    <Modal className='flex justify-center w-72' isOpen={modal_backdrop} toggle={toggle} unmountOnClose={unmountOnClose}>
    <ModalHeader  toggle={toggle}><b>Create a new room</b></ModalHeader>
    <ModalBody>
      <Input
        type="text"
        value={roomCode}
        onChange={(e)=>setRoomCode(e.target.value)}
        placeholder="Enter your room code..."
      />
      <p className='text-green-700 mt-6' id='msg'>{msg}</p>
    </ModalBody>
    <ModalFooter>
      <Button color="dark" onClick={()=>handleCreateRoom()}>
        Create
      </Button>{' '}
      <Button color="" onClick={toggle}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
  );
}
export default CreateRoom