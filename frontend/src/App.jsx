import React from 'react'
import Navbar from './components/Navbar'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettignsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'

import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'

const App = () => {
  const {authUser, checkAuth} = useAuthStore()

  useEffect(() => {
    checkAuth();

  }, [checkAuth]);

  console.log({ checkAuth })
  

  return (
    <div>
      
    <Navbar/>

    <Routes>
    <Route path="/" element={<HomePage />}/>
    <Route path="/signup" element={<SignUpPage />}/>
    <Route path="/login" element={<LoginPage />}/>
    <Route path="/settings" element={<SettignsPage />}/>
    <Route path="/profile" element={<ProfilePage />}/>

    </Routes>

    </div>
  )
}

export default App
