import React, {useState} from 'react'
import { useStateContext } from '../Context/ContextProvider'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from 'reactstrap';
import { fontFamily } from '../constants';
const LeaveRoom = ({handleLeaveRoom}) => {
    const {isLeaving,setIsLeaving,} = useStateContext()
  const toggle = () => setIsLeaving(!isLeaving);
  return (
    <Modal centered={true} style={{fontFamily:fontFamily}} className='flex justify-center w-72' isOpen={isLeaving} toggle={toggle} unmountOnClose={true}>
    <ModalHeader className='!text-sm !border-none' toggle={toggle}>Exit room</ModalHeader>
    <ModalBody className='flex items-center justify-start'>
      <p className='text-gray-950 text-sm' id='msg'>Do you wana miss this listening?</p>
    </ModalBody>
    <ModalFooter className='!border-none'>
    <Button color='dark' className='!text-sm'   onClick={()=>handleLeaveRoom()}>
        Exit
      </Button>
      <Button color='light' className='!text-sm' onClick={toggle}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
  )
}

export default LeaveRoom