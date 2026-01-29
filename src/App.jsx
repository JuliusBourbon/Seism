import { useState, useEffect } from 'react'
import { getDeviceId } from './Data/deviceId'
import { Routes, Route, useLocation  } from 'react-router-dom'
import './App.css'
import Map from './components/map'
import LandingPage from './components/landingPage'

export default function App(){
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const guestLogin = async () => {
      const id = getDeviceId();

      try {
          const response = await fetch('http://localhost:3000/api/auth/guest', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ device_id: id })
          });

          const data = await response.json();
          
          if (response.ok) {
              console.log("User Active:", data.user);
              setCurrentUser(data.user);
          }
      } catch (error) {
          console.error("Failed login as guest:", error);
      }
    };

    guestLogin();
  }, []);
  return(
    <div>
      <main>
        <Routes>
          <Route path='/' element={<LandingPage currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path='/Map' element={<Map currentUser={currentUser}/>}/>
        </Routes>
      </main>
    </div>
  )
}