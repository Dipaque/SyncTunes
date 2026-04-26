import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="h-10 w-10 rounded-full border-4 border-zinc-700 border-t-white animate-spin"></div>
    </div>
  );
};

export default Spinner;
