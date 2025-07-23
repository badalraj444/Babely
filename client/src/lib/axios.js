import axios from 'axios';

const baseURL = import.meta.env.NODE_ENV === 'development'
  ? 'http://localhost:5001/api'
  : '/api';

export const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
})