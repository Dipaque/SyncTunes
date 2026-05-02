import React, { useState, useEffect } from "react";
import { useStateContext } from "../../Context/ContextProvider";
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import { HiOutlineShare } from "react-icons/hi";
import { fontFamily } from "../../constants";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase-config";
import { IoEllipsisVertical, IoPerson, IoGlobeOutline } from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";
import ChangeRoomVisibility from "./ChangeRoomVisibility";
import { handleShare } from "../../Functions/handleShare";

const KebabButton = ({handleExit}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { thumbnail, playedBy, title } = useStateContext();

  const handleOpen = () => {
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(false);
      }, 0);
    } else {
      setIsOpen(true);
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
        className={`!bg-zinc-900 !text-slate-200 !h-[40%] ${
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
        <OffcanvasHeader className="border-b border-b-gray-700 pb-0">
          <div className="flex items-center justify-start !text-sm text-gray-200  gap-2 mb-4">
            <img src={thumbnail || ""} alt="thumbnail" className="h-12 w-16" />
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
          <div className="flex items-center gap-2 text-gray-300" onClick={handleShare}>
            <HiOutlineShare type="button" size={25} className="text-gray-500" />
            Share
          </div>
          <ChangeRoomVisibility />
          <div className="flex items-center gap-2 text-gray-300 mt-4" onClick={handleExit}>
            <VscSignOut type="button" size={25} className="text-gray-500" />
            Exit Room
          </div>
        </OffcanvasBody>
      </Offcanvas>
    </React.Fragment>
  );
};

export default KebabButton;
