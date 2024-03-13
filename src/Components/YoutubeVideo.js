import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { db } from '../firebase-config';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

const YouTubeVideo = ({ videoId }) => {
  const opts = {
    height: '200',
    width: '100%', // Use window.screen.width for width
    playerVars: {
      autoplay: 1,
      fs: 0,
      rel: 0,
      showinfo: 0,
    },
  };
  return (
    <div>
      <YouTube
        videoId={videoId}
        opts={opts}
      />
    </div>
  );
};

export default YouTubeVideo;