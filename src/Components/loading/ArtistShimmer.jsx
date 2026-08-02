import React from 'react';
import { IoArrowBack } from 'react-icons/io5';

const ArtistShimmer = () => {
  return (
    <div className="bg-black min-h-screen pb-28 overflow-y-hidden animate-pulse">
      
      {/* Hero Section Shimmer */}
      <div className="relative w-full h-80 mb-6 bg-zinc-900">
        {/* Back Button Skeleton */}
        <div className="absolute top-4 left-4 p-2 bg-zinc-800 rounded-full w-10 h-10"></div>
        
        {/* Text & Play Button over Hero */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="w-2/3">
            <div className="h-10 bg-zinc-800 rounded-md w-3/4 mb-2"></div>
            <div className="h-4 bg-zinc-800 rounded-md w-1/3"></div>
          </div>
          <div className="w-14 h-14 bg-zinc-800 rounded-full shadow-xl"></div>
        </div>
      </div>

      <div className="px-4">
        {/* Top Songs Shimmer (4 vertical rows) */}
        <div className="mb-8">
          <div className="h-6 w-32 bg-zinc-800 rounded-md mb-4"></div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-row items-center gap-3">
                <div className="h-12 w-16 bg-zinc-800 rounded-lg flex-none"></div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-4 bg-zinc-800 rounded-md w-3/4"></div>
                  <div className="h-3 bg-zinc-800 rounded-md w-1/2"></div>
                </div>
                <div className="w-6 h-6 bg-zinc-800 rounded-full flex-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Albums Shimmer (Horizontal scroll squares) */}
        <div className="mb-8 overflow-hidden">
          <div className="h-6 w-24 bg-zinc-800 rounded-md mb-4"></div>
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-none w-36">
                <div className="w-full aspect-square bg-zinc-800 rounded-md mb-2"></div>
                <div className="h-4 bg-zinc-800 rounded-md w-full mb-1"></div>
                <div className="h-3 bg-zinc-800 rounded-md w-2/3"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Fans Also Like Shimmer (Horizontal scroll circles) */}
        <div className="mb-8 overflow-hidden">
          <div className="h-6 w-32 bg-zinc-800 rounded-md mb-4"></div>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-none w-28 flex flex-col items-center">
                <div className="w-24 h-24 bg-zinc-800 rounded-full mb-2"></div>
                <div className="h-4 bg-zinc-800 rounded-md w-3/4 mb-1"></div>
                <div className="h-3 bg-zinc-800 rounded-md w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ArtistShimmer;