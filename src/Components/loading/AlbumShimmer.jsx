import React from 'react';

const AlbumShimmer = () => {
  return (
    <div className="bg-black min-h-screen pt-8 px-4 pb-28 overflow-y-hidden animate-pulse">
      
      {/* Hero Section Shimmer */}
      <div className="flex flex-col items-center mb-8">
        {/* Album Cover Skeleton */}
        <div className="w-56 h-56 bg-zinc-900 rounded-md mb-6 shadow-lg"></div>
        
        {/* Text & Button Container */}
        <div className="w-full max-w-md flex flex-col items-start px-2">
          {/* Title Skeleton */}
          <div className="h-8 bg-zinc-800 rounded-md w-3/4 mb-3"></div>
          
          <div className="flex flex-row items-center justify-between w-full">
            {/* Metadata Skeleton (Year • Track count) */}
            <div className="h-4 bg-zinc-800 rounded-md w-1/2"></div>
            
            {/* Play Button Skeleton */}
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex-none"></div>
          </div>
        </div>
      </div>

      {/* Tracklist Shimmer */}
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="flex flex-row p-2 px-1 pe-1 justify-center items-center gap-2">
            {/* Track Thumbnail */}
            <div className="h-12 w-16 bg-zinc-900 rounded-lg flex-none"></div>
            
            {/* Track Info */}
            <div className="w-2/3 flex flex-col justify-center gap-2">
              <div className="h-4 bg-zinc-800 rounded-md w-3/4"></div>
              <div className="h-3 bg-zinc-800 rounded-md w-1/2"></div>
            </div>

            {/* 3-dots Menu Skeleton */}
            <div className="w-1 h-4 bg-zinc-800 rounded-full flex-none ml-auto mr-2"></div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default AlbumShimmer;