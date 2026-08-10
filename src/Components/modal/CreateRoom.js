import React, { useState } from 'react';
import {
    Button,
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    FormGroup,
    Input,
} from 'reactstrap';
import Cookies from 'js-cookie';
import { db } from '../../firebase-config';
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { useStateContext } from '../../Context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import { IoCopyOutline, IoGlobeOutline } from 'react-icons/io5';
import '../../App.css';
import { fontFamily } from '../../constants';

function CreateRoom() {
  const nav = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [msg, setMsg] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  
  const { modal_backdrop, setmodal_backdrop } = useStateContext();
  const toggle = () => setmodal_backdrop(!modal_backdrop);
  
  const handleCreateRoom = async () => {
    try {
      await setDoc(doc(db, 'room', roomCode), {
        roomCode: roomCode,
        roomAdmin: Cookies.get('name'),
        roomMates: [
          {
            email: Cookies.get("email"),
            userName: Cookies.get("name"),
            photoUrl: Cookies.get("photoUrl"),
            joinedeAt: Timestamp.now()
          }
        ],
        createdAt: Timestamp.now(),
        adminEmail: Cookies.get("email"),
        isPrivate: isPrivate
      }).then(() => {
        setMsg(`Please copy your room code ${roomCode}.`);
        sessionStorage.setItem('roomCode', roomCode);
        setmodal_backdrop(false);
        nav(`/room/${encodeURI(roomCode)}/search`);
      }).catch(err => {
        setMsg(err);
        console.log(err);
      });
    } catch (err) {
      setMsg(err);
    }
  }
  
  const handleCopy = () => {
    setMsg('Copied to clipboard');
    navigator.clipboard.writeText(roomCode);
  }

  return (
    <Offcanvas 
      direction="bottom" 
      isOpen={modal_backdrop} 
      toggle={toggle} 
      unmountOnClose={true}
      style={{
        fontFamily: fontFamily,
        borderTopLeftRadius: "14px",
        borderTopRightRadius: "14px",
      }}
      className={`!bg-zinc-900 !text-slate-200 !h-auto !max-w-screen-sm !mx-auto ${
        modal_backdrop ? "!animate-drawer" : "!animate-slide-down"
      }`}
    >
      {/* Drawer Handle */}
      <div className="border-1 border-zinc-600 p-[2px] bg-zinc-600 w-10 rounded-full mx-auto mt-3" onClick={toggle} />
      
      <OffcanvasHeader className='!border-none pb-0' toggle={toggle}>
        <b>Create a new room</b>
      </OffcanvasHeader>
      
      <OffcanvasBody className="flex flex-col gap-3 pb-6">
        {msg && (
          <h6 className='mt-2 mb-1 text-start'><b>Here's the link</b></h6>
        )}
        
        <Input
          type="text"
          value={roomCode?.trim()}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Enter your room code..."
          className="bg-zinc-800 border-zinc-700 focus:bg-zinc-800 focus:text-white"
        />

        <span className='text-sm mt-2 text-gray-400 flex items-center justify-between'>
          <div className='flex items-center justify-center gap-1'>
            <IoGlobeOutline size={18} /> Private Room
          </div>
          <FormGroup switch className="m-0">
            <Input
              type="switch"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
              role="switch" 
              size={22}
            />
          </FormGroup>
        </span>
  
        <div className='flex items-center justify-center mt-2'>
          {msg && (
            <IoCopyOutline className='cursor-pointer' color='gray' onClick={handleCopy} size={20} />
          )}
          <p className='m-3 text-start text-sm' id='msg'>{msg}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          {msg ? (
            <Button color="light" className="flex-1 font-semibold" onClick={toggle}>
              Done
            </Button>
          ) : (
            <>
              <Button color="light" className="flex-1 font-semibold" onClick={() => handleCreateRoom()}>
                Create
              </Button>
              <Button color="secondary" outline className="flex-1 font-semibold border-zinc-700 text-white hover:bg-zinc-800" onClick={toggle}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </OffcanvasBody>
    </Offcanvas>
  );
}
export default CreateRoom;