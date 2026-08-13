import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { appCache } from '../utils/cache';

const MAX_CACHE_LIMIT = 30; // Maximum number of items to keep per type

export const useMusicData = (type, id) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !type) return;
      
      const cacheKey = `${type}_${id}`;
      const trackerKey = `${type}_cache_tracker`; // Tracks the list of IDs
      let cachedData = null;

      // 1. FAST LOAD: Check IndexedDB Cache first
      try {
        cachedData = await appCache.get(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false); // Instantly hide spinner
        } else {
          setIsLoading(true);
        }
      } catch (cacheErr) {
        console.warn("Failed to read from cache:", cacheErr);
        setIsLoading(true);
      }
      
      // 2. BACKGROUND FETCH: Get fresh data from the API
      try {
        const auth = getAuth();
        await auth.authStateReady(); 
        
        if (!auth.currentUser) {
          throw new Error("Unauthorized: No user is currently logged in.");
        }

        const token = await auth.currentUser.getIdToken();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/music/${type}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const freshData = response.data;

        // 3. SMART DIFFING: Only trigger a re-render and write to DB if data changed
        const isDataChanged = JSON.stringify(cachedData) !== JSON.stringify(freshData);

        if (isDataChanged || !cachedData) {
          setData(freshData);
          
          // Save the actual album/playlist data
          await appCache.set(cacheKey, freshData);

          // -----------------------------------------------------------
          // 4. LRU CACHE CYCLING (Keep only max 30 items)
          // -----------------------------------------------------------
          try {
            let historyKeys = (await appCache.get(trackerKey)) || [];

            // Remove the current key if it exists (so we can move it to the "most recent" end)
            historyKeys = historyKeys.filter(k => k !== cacheKey);
            
            // Push it to the end of the array (most recently visited)
            historyKeys.push(cacheKey);

            // If we exceed the limit, remove the oldest items (from the front of the array)
            while (historyKeys.length > MAX_CACHE_LIMIT) {
              const oldestKey = historyKeys.shift(); 
              if (appCache.remove) {
                await appCache.remove(oldestKey); // Purge old data from IndexedDB
              }
            }

            // Save the updated tracker list
            await appCache.set(trackerKey, historyKeys);
          } catch (trackerErr) {
            console.warn("Failed to update cache tracker:", trackerErr);
          }
          // -----------------------------------------------------------
        }

      } catch (err) {
        console.error(`Error fetching ${type}:`, err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  return { data, isLoading, error };
};