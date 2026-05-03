import React, { useState } from "react";
import { useStateContext } from "../../Context/ContextProvider";
import Cookies from "js-cookie";

// import context provider
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";

// import icon
import { HiOutlineShare, HiOutlineTrash } from "react-icons/hi";
import { IoEllipsisVertical, IoPerson } from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";

// import constants;
import { fontFamily } from "../../constants";

// import components
import ChangeRoomVisibility from "./ChangeRoomVisibility";

// import utility
import { handleShare } from "../../Functions/handleShare";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import DeleteRoom from "../modal/DeleteRoom";

const KebabButton = ({ handleExit }) => {
  // param id
  const { id } = useParams();
  // context
  const {
    thumbnail,
    playedBy,
    title,
    admin,
    setIsPause,
    handleClear,
  } = useStateContext();
  // email
  const email = Cookies.get("email");
  // room code
  const roomCode = id || sessionStorage.getItem("roomCode");
  // local state
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  // nav
  const nav = useNavigate();

  /**
   * Toggle Drawer
   */
  const handleOpen = () => {
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(false);
      }, 0);
    } else {
      setIsOpen(true);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      // create ref
      const docRef = doc(db, "room", roomCode);
      setIsPause(true);
      // delete room
      await deleteDoc(docRef).then(()=>{
        handleClear();
        sessionStorage.removeItem("roomCode");
        nav("/home");
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <IoEllipsisVertical
        size={20}
        cursor={"pointer"}
        className="text-gray-300 hover:text-slate-400"
        onClick={handleOpen}
      />
      <Offcanvas
        className={`!bg-zinc-900 !text-slate-200 !h-[55%] ${
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
        <div
          className="border-1 border-gray-500 p-[2px] bg-gray-500 w-8 rounded-full mx-auto mt-3"
          onClick={handleOpen}
        />

        <OffcanvasHeader className="border-b border-b-gray-700 pb-0">
          <div className="flex items-center justify-start !text-sm text-gray-200  gap-2 mb-4">
            <img
              src={thumbnail || ""}
              alt="thumbnail"
              className="h-12 w-16 rounded-md"
            />
            <span className="flex items-start gap-2">
              <div className="flex-1">
                <div className="line-clamp-1">{title || "Song name"}</div>
                <p className="flex items-center mt-1 gap-1 text-xs text-gray-500">
                  {" "}
                  <IoPerson /> {playedBy || "artist"}
                </p>
              </div>
            </span>
          </div>
        </OffcanvasHeader>
        <OffcanvasBody>
          <div
            className="flex items-center gap-2 text-gray-300"
            onClick={handleShare}
          >
            <HiOutlineShare type="button" size={25} className="text-gray-500" />
            Share
          </div>
          <ChangeRoomVisibility />
          <div
            className="flex items-center gap-2 text-gray-300 mt-4"
            onClick={handleExit}
          >
            <VscSignOut type="button" size={25} className="text-gray-500" />
            Exit Room
          </div>
          {email === admin.email && (
            <div
              className="flex items-center gap-2 text-red-500 mt-4"
              onClick={()=>setIsOpenDeleteModal(true)}
            >
              <HiOutlineTrash
                type="button"
                size={25}
                className="text-red-500"
              />
              Delete Room
            </div>
          )}
        </OffcanvasBody>
      </Offcanvas>
      
      {
        isOpenDeleteModal && <DeleteRoom isOpenDeleteModal={isOpenDeleteModal} toggle={()=>setIsOpenDeleteModal(!isOpenDeleteModal)} handleDeleteRoom={handleDeleteRoom} />
      }

    </React.Fragment>
  );
};

export default KebabButton;
