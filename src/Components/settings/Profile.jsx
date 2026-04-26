import React from "react";
import Cookies from "js-cookie";
import PageHeader from "../layout/PageHeader";

const Profile = () => {
    
  return (
    <>
          <PageHeader title={"Account"} />

      <div className="flex justify-center mt-3">
        <div className="flex flex-col  gap-2 text-lg  text-slate-100">
          <img
            src={Cookies.get("photoUrl")}
            className="rounded-full h-20 w-20 mx-auto"  
            alt="profile"
          />
        <div>
          <p className="mx-auto text-md text-gray-400 font-semibold">{Cookies.get("name")}</p>
          <p className="mx-auto text-sm text-gray-400 ">{Cookies.get("email")}</p>
        </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
