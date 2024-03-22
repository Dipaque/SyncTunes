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
    <Modal className='flex justify-center w-72' isOpen={isLeaving} toggle={toggle} unmountOnClose={unmountOnClose}>
    {/* <ModalHeader className='text-sm' toggle={toggle}><b>Exit room</b></ModalHeader> */}
    <ModalBody>
      <div className='flex justify-start '>
        <h6>Exit Room</h6>
      </div>
      <p className='text-gray-950 text-start m-3' id='msg'>Do you wana miss this listening?</p>
      <div className='flex justify-end items-center gap-2'>
      <button className='rounded-md bg-black text-white text-center  w-16 h-9' onClick={()=>handleLeaveRoom()}>
        Exit
      </button>
      <button className='rounded-md border-2 border-black text-black w-16 h-9  ' color="" onClick={toggle}>
        Cancel
      </button>
      </div>
    </ModalBody>
    {/* <ModalFooter>
     
    </ModalFooter> */}
  </Modal>
  )
}

export default LeaveRoom