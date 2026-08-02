import axios from 'axios';
import { getAuth } from 'firebase/auth';

// 1. Create the base Axios instance
const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`, // Your Node.js backend
//   timeout: 10000,
});

// 2. Add a Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    
    // Ensure Firebase has finished restoring the session
    await auth.authStateReady();
    
    const user = auth.currentUser;
    if (user) {
      // Get a fresh token (Firebase automatically handles refreshing if expired)
      const token = await user.getIdToken();
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. (Optional) Add a Response Interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized: Please log in again.");
      // You could trigger a logout or redirect to login here
    }
    return Promise.reject(error);
  }
);

export default apiClient;