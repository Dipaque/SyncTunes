import React, { useEffect, useState } from "react";
import {
  IoGlobeOutline,
} from "react-icons/io5";
import { Offcanvas, OffcanvasBody, FormGroup, Input, } from "reactstrap";
import { fontFamily } from "../../constants";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useParams } from "react-router-dom";
import Toast from "../Toast";

const ChangeRoomVisibility = () => {
  // params
  const { id } = useParams();

  // local state
  const [isOpen, setIsOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [toast, setToast] = useState(false);

  //   room code
  const roomCode = id || sessionStorage.getItem("roomCode");

  const handleOpen = () => {
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(false);
      }, 0);
    } else {
      setIsOpen(true);
    }
  };

  const updateRoomStatus = async(checked) => {
    // toggle the state
    setIsPrivate(checked)

    // fire API call to update status
    try{
        const docRef = doc(db, "room", roomCode);
        await updateDoc(docRef,{isPrivate: checked})
        setToast(true)
        // Close after toast 
        setTimeout(()=>{
            setIsOpen(false);
        },1000)
    }catch(err){
        console.log(err)
    }
  }

  useEffect(() => {
    const getRoomVisibility = async () => {
      const docRef = doc(db, "room", roomCode);
      // Fetch room status
      const roomVisibility = (await getDoc(docRef))?.data()?.isPrivate;
      setIsPrivate(roomVisibility);
    };
    getRoomVisibility();
  }, [roomCode]);

  return (
    <React.Fragment>
      <div
        className="flex items-center gap-2 text-gray-300 mt-4"
        onClick={handleOpen}
      >
        <IoGlobeOutline type="button" size={25} className="text-gray-500" />
        Change Visibility
      </div>
      <Offcanvas
        className={`!bg-zinc-900 !text-slate-200  ${
          isOpen ? "!animate-drawer" : "translate-y-0 !animate-slide-down"
        }`}
        direction="bottom"
        toggle={handleOpen}
        isOpen={isOpen}
        unmountOnClose={true}
        style={{
          fontFamily: fontFamily,
          borderTopLeftRadius: "14px",
          borderTopRightRadius: "14px",
        }}
      >
        <OffcanvasBody>
          <span className="text-sm mt-3 text-gray-500 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-300">
              Change to Private
            </div>
            <FormGroup switch>
              <Input
                type="switch"
                checked={isPrivate}
                onChange={(e) => updateRoomStatus(e.target.checked)}
                role="switch"
                size={22}
              />
            </FormGroup>
          </span>
        </OffcanvasBody>
      </Offcanvas>
      {
        toast && <Toast showToast={toast} message={`Room changed ${isPrivate ? "Private" : "Public"}`} />
      }
    </React.Fragment>
  );
};

export default ChangeRoomVisibility;
