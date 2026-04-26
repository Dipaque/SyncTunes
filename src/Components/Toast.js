import React, {useEffect,useState} from 'react'

const Toast = ({message,showToast}) => {
  const [isVisible, setIsVisible] = useState(null);

  useEffect(() => {
    if (showToast) {
      setIsVisible(true);
    } 
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [showToast]);

  if (isVisible==null) return null;
  return (
    <div className={`fixed bottom-24 transition-all duration-300 ease-in-out transform w-[95vw] z-50
               ${isVisible ? "animate-fade-in-up" : isVisible===false? "animate-fade-out-down":""} bg-white rounded-lg border-white h-12 flex items-center justify-center w-60 m-3`}>
  <div className=''>
    <span className='text-sm text-zinc-900'>
      {message}
    </span>
  </div>
</div>
  )
}

export default Toast