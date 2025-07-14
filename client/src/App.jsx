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
import { Navigate } from 'react-router';

export const App = () => {
  const { data:authData, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,
  });
  const authUser = authData?.user;
  // console.log(data);
  // console.log("isLoading:", isLoading);
  // console.log("error:", error);
  return (
    <div className="bg-white-500 h-screen" data-theme="cupcake">
      {/* <button className="btn btn-primary" onClick={() => toast.success('Hello World!')}>Show Toast</button>
      <button className="btn btn-secondary" onClick={() => toast.error('Error!')}>Show Error Toast</button> */}
      <Routes>
        <Route path="/" element={authUser ? <HomPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/"  />} />
        <Route path="/onboarding" element={authUser ? <OnBoardingPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
