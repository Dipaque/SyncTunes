import React from 'react';
import { useStateContext } from '../../Context/ContextProvider';
import { fontFamily } from '../../constants';

const LeaveRoom = ({ handleLeaveRoom }) => {
  const { isLeaving, setIsLeaving } = useStateContext();
  const toggle = () => setIsLeaving(false);

  // If the state is false, don't render anything in the DOM
  if (!isLeaving) return null;

  return (
    /* 1. Pure Tailwind Backdrop */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        style={{ fontFamily: fontFamily }} 
        className="bg-white rounded-xl shadow-2xl w-72 overflow-hidden animate-slide-up"
      >
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-gray-900 text-base font-bold m-0">Exit room</h2>
        </div>
        
        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-gray-700 text-sm m-0" id="msg">
            Do you wanna miss this listening?
          </p>
        </div>
        
        {/* Footer with native HTML buttons (No Reactstrap dependencies) */}
        <div className="px-5 py-3 flex justify-end gap-3 bg-gray-50 border-t border-gray-100">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors focus:outline-none"
            onClick={toggle}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-black transition-colors focus:outline-none"
            onClick={() => {
              toggle(); // Close modal visually first
              handleLeaveRoom(); // Then execute exit logic
            }}
          >
            Exit
          </button>
        </div>

      </div>
    </div>
  );
}

export default LeaveRoom;