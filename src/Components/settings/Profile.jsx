import React, { useState } from "react";
import Cookies from "js-cookie";
import { IoPersonCircleOutline } from "react-icons/io5";
import { fontFamily } from "../../constants";
import { Offcanvas, OffcanvasBody } from "reactstrap";
import { HiOutlineCamera } from "react-icons/hi";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      <div
        className="text-white  text-md flex justify-start  items-center gap-2"
        onClick={handleOpen}
      >
        <IoPersonCircleOutline color="white" size={29} />
        <span className="flex-1">
          <span className="font-semibold text-[15px]">Account</span> <br />
          <span className="text-xs text-gray-400">
            Profile &middot; Personal Information
          </span>
        </span>
      </div>
      <Offcanvas
        className={`!bg-zinc-900 !text-slate-200 !h-[50%] ${
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
        <OffcanvasBody className="!text-sm">
          <div
            className="border-1 border-gray-500 p-[2px] bg-gray-500 w-8 rounded-full mx-auto mb-4"
            onClick={handleOpen}
          />
          <div className="flex flex-col gap-2 text-lg  text-slate-100">
            <div className="relative">
              <img
                src={Cookies.get("photoUrl")}
                className="rounded-full h-24 w-2h-24 mx-auto"
                alt="profile"
              />
              <div className="bg-black rounded-full p-1 h-9 w-9 flex items-center justify-center absolute right-1/3 bottom-0">
                <HiOutlineCamera size={23} />
              </div>
            </div>
            <div className="text-sm !text-start">
              <span>Username</span>
              <p className="text-sm text-gray-500 ">{Cookies.get("name")}</p>
              <span>Email</span>
              <p className="text-sm text-gray-500 ">{Cookies.get("email")}</p>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Your profile helps people to recognize you.
              </p>
            </div>
          </div>
        </OffcanvasBody>
      </Offcanvas>
    </>
  );
};

export default Profile;
