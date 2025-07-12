import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Skills from './pages/Skills';
import SwapRequests from './pages/SwapRequests';
import Ratings from './pages/Ratings';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/skills" 
                element={
                  <ProtectedRoute>
                    <Skills />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/swap-requests" 
                element={
                  <ProtectedRoute>
                    <SwapRequests />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ratings" 
                element={
                  <ProtectedRoute>
                    <Ratings />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
