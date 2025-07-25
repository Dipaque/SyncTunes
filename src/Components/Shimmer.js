import React from 'react'

const Shimmer = () => {
  return (
    <div className='flex flex-row m-3 justify-start items-center gap-2 text-white cursor-pointer animate-pulse'>
    <div className='rounded-lg h-16 w-16 bg-gray-500 '></div>
    <span className='w-2/3 bg-gray-500 h-6 rounded-lg'></span>
  </div>
  )
}

export default Shimmer