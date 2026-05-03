import React from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../layout/PageHeader'
import packageJson from "../../../package.json"

// import icons
import { LuBookMarked } from "react-icons/lu";
import { LuBookText } from "react-icons/lu";
import { BsIncognito } from "react-icons/bs";
import { TbVersions } from "react-icons/tb";


const About = () => {

  return (
    <>
      <PageHeader title={"Others"} />
    <div className='text-white ml-4 text-md flex flex-col justify-start  items-start '>


        <div className='mt-2 flex flex-col justify-end items-start gap-8'>
          <Link to={'/third-party'} className='no-underline'>
          <button className=' text-slate-50 flex flex-row gap-2   items-center justify-start text-sm'>
          <LuBookMarked size={23} />  
          Third-party Software
        </button>
        </Link>
          <Link to={'/privacy-policy'} className='no-underline'>
        <button className='text-slate-50 flex flex-row gap-2   items-center justify-start text-sm'>
        <BsIncognito size={23} />  
          Privacy Policy
        </button>
        </Link>
        <Link to={'/terms'} className='no-underline'>
        <button className='text-slate-50 flex flex-row gap-2  items-center justify-start text-sm '>
        <LuBookText size={23} />  
          Terms and Conditions
        </button>
        </Link>
        <span className='flex flex-row gap-2  items-start justify-start text-slate-50 text-sm'>
        <TbVersions size={24} />  
        <div>
          Version <br />
          <span className='text-gray-500'>{packageJson.version}</span>
        </div>
        </span>
        </div>
      </div>
    </>

  )
}

export default About