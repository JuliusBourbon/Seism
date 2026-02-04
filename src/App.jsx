import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Map from './components/map'
import LandingPage from './components/landingPage'
import ConfirmModal from './components/confirmPopup'

export default function App(){
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_session');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Gagal memuat sesi:", error);
        localStorage.removeItem('user_session');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    // console.log("User Login:", userData);
    localStorage.setItem('user_session', JSON.stringify(userData)); 
    setCurrentUser(userData);
  };

  const requestLogout = () => {
    setShowLogoutConfirm(true);
  };

  const executeLogout = () => {
    localStorage.removeItem('user_session');
    setCurrentUser(null);
    setShowLogoutConfirm(false);
  };

  return(
    <div>
      <ConfirmModal 
        isOpen={showLogoutConfirm}
        title="Keluar Akun?"
        message="Anda akan keluar dari sesi ini."
        onConfirm={executeLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        isDestructive={true}
      />
      <main>
        <Routes>
          <Route 
            path='/' 
            element={
              <LandingPage 
                currentUser={currentUser} 
                onLoginSuccess={handleLoginSuccess} 
                onLogout={requestLogout}
              />
            } 
          />
          <Route 
            path='/Map' 
            element={
              <Map 
                currentUser={currentUser} 
                onLoginSuccess={handleLoginSuccess} 
                onLogout={requestLogout}
              />
            }
          />
        </Routes>
      </main>
    </div>
  )
}