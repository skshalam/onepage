import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthUser() {
  const navigate = useNavigate();
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken;
  };

  const getRefreshToken = () => {
    const refreshTokenString = sessionStorage.getItem('refreshToken');
    const userRefreshToken = JSON.parse(refreshTokenString);
    return userRefreshToken;
  };

  const [token, setToken] = useState(getToken());
  const [refreshToken, setRefreshToken] = useState(getRefreshToken());

  const saveToken = (token, refreshToken) => {
    sessionStorage.setItem('token', JSON.stringify(token));
    sessionStorage.setItem('refreshToken', JSON.stringify(refreshToken)); // Fixed: should save refreshToken
    setToken(token);
    setRefreshToken(refreshToken);
    navigate('/About');
};

  const http = axios.create({
    // baseURL: env('REACT_APP_API_BASE_URL'),
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  useEffect(() => {
    // Set the Authorization header when the token changes
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const interceptor = http.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const response = await axios.post(`/api/refresh-token`, { token: refreshToken });
            const newAccessToken = response.data.accessToken;
            saveToken(newAccessToken, refreshToken);
            http.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return http(originalRequest);
          } catch (err) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refreshToken');
            navigate('/');
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up interceptor
      http.interceptors.response.eject(interceptor);
    };
  }, [token, refreshToken, http, navigate]);

  return {
    setToken: saveToken,
    token,
    getToken,
    http
  };
}

export default AuthUser;
