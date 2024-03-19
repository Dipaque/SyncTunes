import React from 'react'

const Toast = ({message}) => {
  return (
    <div className="fixed bottom-5 bg-white rounded-lg border-white h-12 flex items-center justify-center w-60 m-3">
  <div className=''>
    <span>
      {message}
    </span>
  </div>
</div>
  )
}

export default Toast