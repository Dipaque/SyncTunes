import React from 'react'
import { useStateContext } from '../../Context/ContextProvider'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from 'reactstrap';
import { fontFamily } from '../../constants';

const DeleteRoom = ({isOpenDeleteModal,toggle, handleDeleteRoom}) => {
    
  return (
    <Modal centered={true} style={{fontFamily:fontFamily}} className='flex justify-center w-72' isOpen={isOpenDeleteModal} toggle={toggle} unmountOnClose={true}>
    <ModalHeader className='!text-sm !border-none text-red-600' toggle={toggle}>Delete room</ModalHeader>
    <ModalBody className='flex items-center justify-start'>
      <p className='text-gray-950 text-sm' id='msg'>Are you sure?<br />Once room deleted, cannot be restore</p>
    </ModalBody>
    <ModalFooter className='!border-none'>
    <Button color='danger' className='!text-sm'   onClick={()=>handleDeleteRoom()}>
        Delete
      </Button>
      <Button color='light' className='!text-sm' onClick={toggle}>
        Cancel
      </Button>
    </ModalFooter>
  </Modal>
  )
}

export default DeleteRoom