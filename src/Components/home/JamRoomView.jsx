import React from "react";
import { IoAdd, IoLogIn } from "react-icons/io5";

const JamRoomView = ({ setmodal_backdrop, setmodal_backdrop1 }) => {
  return (
    <div className="px-4 animate-fade-in flex flex-col h-full mt-4">
      <div className="flex justify-center gap-3 mb-8 w-full max-w-sm mx-auto">
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-slate-50 py-3 rounded-xl text-black font-semibold hover:bg-slate-200 transition-colors"
          onClick={() => setmodal_backdrop(true)}
        >
          <IoAdd size={20} />
          New Room
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-transparent border-2 border-zinc-700 py-3 rounded-xl text-white font-semibold hover:border-zinc-500 transition-colors"
          onClick={() => setmodal_backdrop1(true)}
        >
          <IoLogIn size={20} />
          Join Code
        </button>
      </div>

      <div className="flex flex-col justify-center items-center mt-6 text-slate-50 max-w-xs mx-auto text-center bg-zinc-900/40 p-6 rounded-2x rounded-lg">
        <img
          src={require("../../assests/recorder.png")}
          className="h-32 w-32 object-contain mb-6 drop-shadow-xl opacity-90"
          alt="recorder"
        />
        <h5 className="text-lg font-bold mb-2 tracking-tight">
          Share The Beats
        </h5>
        <p className="text-sm text-gray-400 leading-relaxed">
          Create a new room to generate a unique sync code. Share it with friends to listen together in real-time.
        </p>
      </div>
    </div>
  );
};

export default JamRoomView;