import React from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../layout/PageHeader'
import packageJson from "../../../package.json"


const About = () => {

  return (
    <>
      <PageHeader title={"Others"} />
    <div className='text-white ml-4 text-md flex flex-col justify-start  items-start '>


        <div className='mt-2 mb-16 flex flex-col justify-end items-start gap-3'>
          <Link to={'/third-party'} className='no-underline'>
          <button className='text-slate-50 flex flex-row-reverse gap-2   items-center justify-start text-sm'>
          Third-party Software
        </button>
        </Link>
          <Link to={'/privacy-policy'} className='no-underline'>
        <button className='text-slate-50 flex flex-row-reverse gap-2   items-center justify-start text-sm'>
          Privacy Policy
        </button>
        </Link>
        <Link to={'/terms'} className='no-underline'>
        <button className='text-slate-50 flex flex-row-reverse gap-2  items-center justify-start text-sm '>
          Terms and Conditions
        </button>
        </Link>
        <span className='text-slate-50 text-sm'>
          Version <br />
          <span className='text-zinc-700'>{packageJson.version}</span>
        </span>
        </div>
      </div>
    </>

  )
}

export default About