import React, { useState, useEffect } from 'react';
import {
    Button,
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
    Input,
} from 'reactstrap';
import { db } from '../../firebase-config';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { useStateContext } from '../../Context/ContextProvider';
import Cookies from 'js-cookie';
import { fontFamily } from '../../constants';
import { useNavigate } from 'react-router-dom';

function JoinRoom({ codeViaProps }) {
  const nav = useNavigate();
  const { modal_backdrop1, setmodal_backdrop1, setJoineeSong, setIsPause, isPause } = useStateContext();
  const email = Cookies.get("email");
  const existingRoomCode = sessionStorage.getItem("roomCode");
  
  const [roomCode, setRoomCode] = useState('');
  const [msg, setMsg] = useState('');

  const toggle = () => setmodal_backdrop1(!modal_backdrop1);
  
  const handleJoinRoom = async () => {
    const data = await getDoc(doc(db, 'room', roomCode || codeViaProps));
    if (data.exists()) {
      sessionStorage.setItem('roomCode', roomCode || codeViaProps);
      setJoineeSong(data.data().currentSong);
      
      const roomMates = data.data().roomMates || [];
      const isPresent = roomMates.some((user) => user.email === email);
      
      if (!isPresent) {
        await updateDoc(doc(db, 'room', roomCode || codeViaProps), {
          roomMates: [...roomMates, {
            email: Cookies.get("email"),
            userName: Cookies.get("name"),
            photoUrl: Cookies.get("photoUrl"),
            joinedeAt: Timestamp.now()
          }]
        });
      }
      
      if (isPause) {
        setIsPause(false);
      }
      
      if (!codeViaProps && roomCode) {
        nav(`/room/${roomCode || codeViaProps}/player`);
        setmodal_backdrop1(false);
      }
    } else {
      setMsg('Room code is incorrect');
    }
  }

  useEffect(() => {
    if ((codeViaProps && (codeViaProps && !existingRoomCode)) || (codeViaProps && (codeViaProps !== existingRoomCode))) {
      handleJoinRoom();
    }
  }, [codeViaProps, existingRoomCode]);

  return (
    <Offcanvas 
      direction="bottom" 
      isOpen={modal_backdrop1} 
      toggle={toggle} 
      unmountOnClose={true}
      style={{
        fontFamily: fontFamily,
        borderTopLeftRadius: "14px",
        borderTopRightRadius: "14px",
      }}
      className={`!bg-zinc-900 !text-slate-200 !h-auto !max-w-screen-sm !mx-auto ${
        modal_backdrop1 ? "!animate-drawer" : "!animate-slide-down"
      }`}
    >
      {/* Drawer Handle */}
      <div className="border-1 border-zinc-600 p-[2px] bg-zinc-600 w-10 rounded-full mx-auto mt-3" onClick={toggle} />
      
      <OffcanvasHeader className='!border-none pb-0' toggle={toggle}>
        <b>Join the room</b>
      </OffcanvasHeader>
      
      <OffcanvasBody className="flex flex-col gap-3 pb-6 pt-4">
        <Input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Enter your room code..."
          className="bg-zinc-800  border-zinc-700 focus:bg-zinc-800 focus:text-white mb-2"
        />
        
        {msg && <p className='text-red-500 text-center text-sm m-0'>{msg}</p>}

        <div className="flex gap-3 mt-4">
          <Button color="light" className="flex-1 font-semibold" onClick={() => handleJoinRoom()}>
            Join
          </Button>
          <Button color="secondary" outline className="flex-1 font-semibold border-zinc-700 text-white hover:bg-zinc-800" onClick={toggle}>
            Cancel
          </Button>
        </div>
      </OffcanvasBody>
    </Offcanvas>
  );
}

export default JoinRoom;