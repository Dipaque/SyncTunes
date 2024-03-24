import React, { useRef, useEffect } from 'react';
import '../App.css'; // Import your CSS file for styling

const Marquee = ({ children }) => {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marqueeElement = marqueeRef.current;

    const scrollWidth = marqueeElement.scrollWidth;
    const clientWidth = marqueeElement.clientWidth;

    if (scrollWidth > clientWidth) {
      const animationDuration = (scrollWidth / 50) * 1000; // Adjust the scrolling speed as needed
      marqueeElement.style.animationDuration = `${animationDuration}ms`;
    }
  }, [children]);

  return (
    <div className="marquee-container">
      <h6 ref={marqueeRef} className="marquee text-slate-50 mt-5">
        {children}
      </h6>
    </div>
  );
};

export default Marquee;
