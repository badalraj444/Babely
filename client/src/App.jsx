import React from 'react'
import { Routes, Route } from 'react-router';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import HomPage from './pages/HomPage';
import LoginPage from './pages/LoginPage';
import NotificationPage from './pages/NotificationPage';
import OnBoardingPage from './pages/OnBoardingPage';
import SignUpPage from './pages/SignUpPage';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios';
export const App = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,
  });

  console.log(data);
  console.log("isLoading:", isLoading);
  console.log("error:", error);
  return (
    <div className="bg-white-500 h-screen" data-theme="cupcake">
      <button className="btn btn-primary" onClick={() => toast.success('Hello World!')}>Show Toast</button>
      <button className="btn btn-secondary" onClick={() => toast.error('Error!')}>Show Error Toast</button>
      <Routes>
        <Route path="/" element={<HomPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/onboarding" element={<OnBoardingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
