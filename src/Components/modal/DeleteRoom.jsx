import React from 'react';
import { fontFamily } from '../../constants';

const DeleteRoom = ({ isOpenDeleteModal, toggle, handleDeleteRoom }) => {
  // If the state is false, don't render anything
  if (!isOpenDeleteModal) return null;

  return (
    /* 1. Pure Tailwind Backdrop */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        style={{ fontFamily: fontFamily }} 
        className="bg-white rounded-xl shadow-2xl w-72 overflow-hidden animate-slide-up"
      >
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-red-600 text-base font-bold m-0">Delete room</h2>
        </div>
        
        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-gray-700 text-sm m-0 leading-relaxed" id="msg">
            Are you sure? <br />
            Once room is deleted, it cannot be restored.
          </p>
        </div>
        
        {/* Footer with native HTML buttons */}
        <div className="px-5 py-3 flex justify-end gap-3 bg-gray-50 border-t border-gray-100">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors focus:outline-none"
            onClick={toggle}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors focus:outline-none shadow-sm"
            onClick={() => {
              toggle(); // Close modal visually first
              handleDeleteRoom(); // Execute delete logic
            }}
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}

export default DeleteRoom;