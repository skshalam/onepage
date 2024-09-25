import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
// Create an instance of Axios without a baseURL
const axiosSetup = axios.create();  

const isTokenExpired = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    }
    return true; // If no token exists, treat it as expired
};

// Add a request interceptor to include the access token
axiosSetup.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');

        if (isTokenExpired()) {
            // If the token is expired, remove it and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('expires_in');

            const navigate = useNavigate(); // Use react-router-dom's useNavigate hook
            navigate('/'); // Redirect to login page

            return Promise.reject(new Error('Token expired. Redirecting to login.'));
        }

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle the error
        return Promise.reject(error);
    }
);

export default axiosSetup;