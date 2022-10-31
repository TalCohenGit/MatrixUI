import React from 'react'
import { logout } from '../utils/utils';

const Logout = ({setAccessToken, setRefreshToken}) => {
    const handleLogout = async () => {
        console.log("logout")
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