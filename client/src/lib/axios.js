import axios from 'axios';

const baseURL = import.meta.env.VITE_MODE === 'development'
  ? 'http://localhost:5001/api'
  : '/api';

export const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
})

