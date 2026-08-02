import React from 'react';

const NotFoundGraphic = ({ className }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 240 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Tangled Tape Ribbon */}
    <path
      d="M120 160 C 120 190, 40 180, 50 205 C 60 230, 160 200, 140 225 C 120 250, 190 220, 200 200"
      stroke="#1D1C22"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M120 160 C 120 190, 40 180, 50 205 C 60 230, 160 200, 140 225 C 120 250, 190 220, 200 200"
      stroke="#91A3D8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Cassette Body */}
    <rect x="40" y="60" width="160" height="100" rx="8" fill="#91A3D8" stroke="#1D1C22" strokeWidth="6" />

    {/* Inner Label */}
    <rect x="60" y="75" width="120" height="50" rx="4" fill="#F3A8C2" stroke="#1D1C22" strokeWidth="6" />
    <rect x="60" y="105" width="120" height="20" fill="#A7E4A9" stroke="#1D1C22" strokeWidth="6" />

    {/* Spools & Details */}
    <circle cx="90" cy="100" r="14" fill="#1D1C22" />
    <circle cx="150" cy="100" r="14" fill="#1D1C22" />
    
    {/* Spool inner X marks */}
    <path d="M85 95 L95 105 M95 95 L85 105" stroke="#F3A8C2" strokeWidth="3" strokeLinecap="round" />
    <path d="M145 95 L155 105 M155 95 L145 105" stroke="#A7E4A9" strokeWidth="3" strokeLinecap="round" />

    {/* Bottom Trapezoid Section */}
    <path d="M70 160 L80 140 H160 L170 160 Z" fill="#91A3D8" stroke="#1D1C22" strokeWidth="6" strokeLinejoin="round" />
    <circle cx="90" cy="150" r="4" fill="#1D1C22" />
    <circle cx="150" cy="150" r="4" fill="#1D1C22" />

    {/* Floating Question Marks */}
    <text x="180" y="45" fontSize="36" fill="#F3A8C2" fontWeight="900" stroke="#1D1C22" strokeWidth="2" style={{ fontFamily: 'sans-serif' }}>?</text>
    <text x="25" y="65" fontSize="28" fill="#A7E4A9" fontWeight="900" stroke="#1D1C22" strokeWidth="2" style={{ fontFamily: 'sans-serif' }}>?</text>
  </svg>
);

export default NotFoundGraphic;