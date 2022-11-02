import React from 'react'
// import { logout } from '../utils/utils';
import {logoutAPI} from "../api"


const Logout = ({setAccessToken, setRefreshToken}) => {

  const logout = async (setAccessToken, setRefreshToken) => {
    setAccessToken("");
    setRefreshToken("");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("timeLimit");
    localStorage.removeItem("userEmail")
    await logoutAPI();
  }

  const handleLogout = async () => {
      await logout(setAccessToken, setRefreshToken)        
  }

  return (
    <div>
         <button
            className="login-button"
            onClick={() => handleLogout()}
          >
             ניתוק מהמערכת
          </button>       
    </div>
    
  )
}

Logout.propTypes = {}

export default Logout