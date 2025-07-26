import React, { useState } from "react";
import { useStateContext } from "../Context/ContextProvider";
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import { LuUsers } from "react-icons/lu";
import { fontFamily } from "../constants";

const RoommatesDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);
  const { roomMate, admin, } =
    useStateContext();
    const handleOpen = () => {
        setIsOpen(!isOpen);
      };
    
  return (
    <React.Fragment>
<LuUsers size={20}
        cursor={"pointer"}
        onClick={handleOpen}
        className="text-white hover:text-slate-400" />
        <Offcanvas
        className={`!bg-zinc-900 !text-slate-200 !h-[50%] ${
          isOpen ? "!animate-drawer" : "!animate-slide-down"
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
        <OffcanvasHeader>
          <h6 className="text-sm font-bold">Roommates</h6>
        </OffcanvasHeader>
        <OffcanvasBody>
          {
            roomMate.map((user,i)=>(
         <div className="mb-3 flex items-center justify-between" key={`key-${i}`}>
          <div className="flex items-center gap-3">
            <img src={user.photoUrl} className="rounded-full" height={35} width={35} alt="user-profile" />
            <span>{user.userName}</span>
          </div>
           { user.email=== admin.email && <div className="bg-[#162312] border-2 border-[#244415] text-[#3a8216] p-1 rounded-md text-xs">
              Admin
            </div>}
         </div>
            ))
          }
        </OffcanvasBody>
      </Offcanvas>
    </React.Fragment>
  )
}

export default RoommatesDrawer