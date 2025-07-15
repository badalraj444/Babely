import React from 'react'
import { Routes, Route } from 'react-router';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import HomPage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotificationsPage from './pages/NotificationsPage';
import OnBoardingPage from './pages/OnBoardingPage';
import SignUpPage from './pages/SignUpPage';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios';
import { Navigate } from 'react-router';
import PageLoader from './components/PageLoader';
import { getAuthUser } from './lib/api';
import useAuthUser from './hooks/useAuthUser';
import Layout from './components/Layout';
export const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  if (isLoading) return <PageLoader />;
  return (
    <div className="bg-white-500 h-screen" data-theme="forest">
      {/* <button className="btn btn-primary" onClick={() => toast.success('Hello World!')}>Show Toast</button>
      <button className="btn btn-secondary" onClick={() => toast.error('Error!')}>Show Error Toast</button> */}
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (<Layout showSidebar="true"><HomPage /></Layout>) : (isAuthenticated ? <Navigate to="/onboarding" /> : <Navigate to="/login" />)} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
        <Route path="/onboarding" element={isAuthenticated ? (!isOnboarded ? <OnBoardingPage /> : <Navigate to="/" />) : <Navigate to="/login" />} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
         <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
