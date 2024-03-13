import React from 'react'
import Icon from '@mdi/react'
import { mdiPlay } from '@mdi/js'
const Shimmer = () => {
  return (
    <div className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4'>
  <div class="flex flex-col mt-6 text-gray-700  bg-gray-800 shadow-md bg-clip-border rounded-xl w-72">
    <div class="animate-pulse relative bg-gray-900 h-32 mx-4 -mt-6 overflow-hidden bg-gradient-to-r from-blue-gray-300 to-blue-gray-400 rounded-xl">
    </div>
    <div class="p-3">
      <div class="animate-pulse  block mb-2 font-sans w-45 text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
      
      </div>
    </div>
    <div class="p-6 pt-0">
      <button class="animate-pulse align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs p-3 rounded-full bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none" type="button" >
        <Icon path={mdiPlay} size={1} />
      </button>
    </div>
  </div>
</div>
  )
}

export default Shimmer