import React from 'react'

const Thirdparty = () => {
  return (
    <div className='bg-black overflow-hidden overflow-y-scroll '>
    <div className='text-white m-3 ml-4 '> 
  <h6><b>Third-Party Credits</b></h6>
  <div className='text-sm mt-2'>
  <p>We would like to express our gratitude to the following free and open-source software libraries and services that have contributed to the development of our web application:</p>
  <ul className='flex items-start flex-col gap-2'>
    <li><a className='no-underline  text-white' href="https://github.com/troybetz/react-youtube" target="_blank" rel="noopener noreferrer">React-Youtube</a></li>
    <li>Firestore Database</li>
    <li>Firebase Authentication</li>
    <li>Youtube</li>
    <li>Gemini</li>
    <li>Rapid API</li>
    <li><a className='no-underline  text-white' href="https://reactstrap.github.io/" target="_blank" rel="noopener noreferrer">Reactstrap</a></li>
    <li><a className='no-underline  text-white' href="https://www.npmjs.com/package/react-icons/" target="_blank" rel="noopener noreferrer">React Icons</a></li>
    <li>React.js</li>
    <li><a className='no-underline  text-white' href="https://www.npmjs.com/package/react-copy-to-clipboard" target="_blank" rel="noopener noreferrer">React Copy to Clipboard</a></li>
    <li><a className='no-underline  text-white' href="https://www.npmjs.com/package/react-fast-marquee" target="_blank" rel="noopener noreferrer">React Fast Marquee</a></li>
  </ul>
  <p>We extend our appreciation to the developers and contributors of these projects for their valuable work and contributions to the open-source community.</p>
</div>
    </div>
    </div>
  )
}

export default Thirdparty