import React from 'react'

const Toast = ({message,color}) => {
  return (
    <div className="toast toast-center">
  <div className={`alert alert-${color}`}>
    <span>{message}</span>
  </div>
</div>
  )
}

export default Toast