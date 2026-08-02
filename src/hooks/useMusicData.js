import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

export const useMusicData = (type, id) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      
      try {
        const auth = getAuth();
        
        // 1. Wait for Firebase to fully restore the auth session
        await auth.authStateReady(); 
        
        // 2. Explicitly check if the user exists after initialization
        if (!auth.currentUser) {
          throw new Error("Unauthorized: No user is currently logged in.");
        }

        // 3. Fetch the token securely
        const token = await auth.currentUser.getIdToken();
        
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${type}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setData(response.data);
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