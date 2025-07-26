import React from "react";
import CreateRoom from "../Components/CreateRoom";
import JoinRoom from "../Components/JoinRoom";
import { useStateContext } from "../Context/ContextProvider";
import Cookies from "js-cookie";

const Home = () => {
  const {
    setmodal_backdrop1,
    setmodal_backdrop,
  } = useStateContext();

 
  return (
    <>
      <CreateRoom />
      <JoinRoom />
      <div className=" m-3 ">
        {Cookies.get("name") &&
           (
           
              <b className="text-white">
                {"Welcome " + Cookies.get("name").split(" ")[0] ||
                  Cookies.get("name")}
              </b>
          )}
      </div>

      <div className=" flex justify-center gap-2 mb-5 p-3  mx-auto">
        <button
          className="border pl-2 pr-2 bg-slate-50 w-full   p-2 rounded-lg text-black"
          type="button"
          onClick={() => {
            setmodal_backdrop(true);
          }}
        >
          New Room
        </button>
        <button
          className="border-zinc-500 border-1 pl-2 pr-2  w-full  p-2 rounded-lg text-white"
          onClick={() => {
            setmodal_backdrop1(true);
          }}
        >
          Join with a code
        </button>
      </div>
      <div className="flex flex-col justify-center items-center mt-14 m-3 text-slate-50">
        <img
          src={require("../assests/recorder.png")}
          height={200}
          width={200}
          alt="recorder"
        />
        <h5>
          <b>Get the link that you can share</b>
        </h5>
        <p className="text-sm text-center">
          Tap on new room to generate your own room code and share it with your
          friends!
        </p>
      </div>
    </>
  );
};

export default Home;
