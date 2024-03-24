import React, {useState} from 'react'
import { useStateContext } from '../Context/ContextProvider'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from 'reactstrap';
const LeaveRoom = ({handleLeaveRoom}) => {
    const {isLeaving,setIsLeaving} = useStateContext()
    const [unmountOnClose, setUnmountOnClose] = useState(true);

  const toggle = () => setIsLeaving(!isLeaving);
  return (
    <Modal centered={true} className='flex justify-center' isOpen={isLeaving} toggle={toggle} unmountOnClose={unmountOnClose}>
    <ModalHeader className='text-sm' toggle={toggle}><b>Exit room</b></ModalHeader>
    <ModalBody className='flex items-center justify-start'>
      <p className='text-gray-950' id='msg'>Do you wana miss this listening?</p>
    </ModalBody>
    <ModalFooter>
    <Button color='dark'  onClick={()=>handleLeaveRoom()}>
        Exit
      </Button>
      <Button color="" onClick={toggle}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
  )
}

export default LeaveRoom