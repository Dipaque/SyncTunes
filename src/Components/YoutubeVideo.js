import React from 'react';
import YouTube from 'react-youtube';

const YouTubeVideo = ({ videoId }) => {
  const opts = {
    height: '200',
    width: window.screen,
    playerVars: {
      autoplay: 1,
      fs:0,
      rel: 0,
      // Disable the "more" option on the player
      showinfo: 0,
      
    },
  };

  return <YouTube  videoId={videoId} opts={opts} />;
};

export default YouTubeVideo;
