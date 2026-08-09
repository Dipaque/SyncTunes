import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/apiClient';
import { useStateContext } from '../../Context/ContextProvider';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { CgTranscript } from 'react-icons/cg';

const Lyrics = () => {
  const { currentPlaying } = useStateContext();
  const [lyrics, setLyrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      // Don't fetch if no song is currently playing
      if (!currentPlaying?.id) {
        setLyrics(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const { data } = await apiClient.get(`/music/lyrics/${currentPlaying.id}`);
        
        // Handle different possible API response structures
        if (data) {
          setLyrics(data);
        } else if (typeof data === 'string') {
          setLyrics(data);
        } else {
          setLyrics(null);
          setError("No lyrics available for this track.");
        }
      } catch (err) {
        console.error("Lyrics fetch error:", err);
        setError("Could not load lyrics. They might not be available.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLyrics();
  }, [currentPlaying?.id]);

  // Hide the component entirely if there's no song playing
  if (!currentPlaying?.id) return null;

  return (
    <div className="w-full max-w-screen-sm mx-auto px-3 mb-20">
      <div className="bg-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm ">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <CgTranscript size={20} color="white" />
          <h3 className="text-white font-bold text-lg m-0">Lyrics</h3>
        </div>

        {/* Content Area */}
        <div className="min-h-[200px] max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          
          {isLoading && (
            <div className="flex flex-col gap-3 animate-pulse pt-4">
              <div className="h-4 bg-zinc-700 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-zinc-700 rounded w-2/4 mx-auto"></div>
              <div className="h-4 bg-zinc-700 rounded w-5/6 mx-auto"></div>
              <div className="h-4 bg-zinc-700 rounded w-1/2 mx-auto mt-4"></div>
              <div className="h-4 bg-zinc-700 rounded w-3/4 mx-auto"></div>
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 pt-10 pb-10">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!isLoading && !error && lyrics && (
            <div className="text-zinc-300 text-base leading-relaxed text-center font-medium">
              {/* white-space: pre-wrap ensures line breaks from the API string are rendered correctly */}
              <p style={{ whiteSpace: 'pre-wrap' }}>{lyrics}</p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Lyrics;