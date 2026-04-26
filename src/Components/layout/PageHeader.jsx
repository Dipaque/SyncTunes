import React from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const PageHeader = ({title}) => {

  const nav = useNavigate()

  return (
    <div className="grid grid-cols-3 items-center px-4 py-3 mb-3 text-white text-md font-semibold bg-zinc-900">
    <div className="col-span-1 flex justify-start"  onClick={() => nav(-1)}>
      <IoArrowBack size={23}  />
    </div>
  
    <div className="col-span-1 flex justify-center">
      <span>{title}</span>
    </div>
  
    <div className="col-span-1"></div>
  </div>
  )
}

export default PageHeader