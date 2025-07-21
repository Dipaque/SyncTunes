import React, {useEffect,useState} from 'react'

const Toast = ({message,showToast}) => {
  const [isVisible, setIsVisible] = useState(null);

  useEffect(() => {
    if (showToast) {
      setIsVisible(true);
    } 
    const timer = setTimeout(() => setIsVisible(false), 1000);
    return () => clearTimeout(timer);
  }, [showToast]);

  if (isVisible==null) return null;
  return (
    <div className={`fixed bottom-14 transition-all duration-300 ease-in-out transform
               ${isVisible ? "animate-fade-in-up" : isVisible===false? "animate-fade-out-down":""} bg-white rounded-lg border-white h-12 flex items-center justify-center w-60 m-3`}>
  <div className=''>
    <span>
      {message}
    </span>
  </div>
</div>
  )
}

export default Toast