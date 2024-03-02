import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import Typography from "@mui/material/Typography";

const SessionTimer = () => {
  const [sessionTimeLeft, setSessionTimeLeft] = useState(null);
  const [sessionEnd, setSessionEnd] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        const expiresIn = decodedToken.exp - currentTime;
        setSessionTimeLeft(expiresIn);
        setSessionEnd(decodedToken.exp - currentTime)
        
        // Actualiza el tiempo restante cada segundo
        const interval = setInterval(() => {
          const currentTime = Math.floor(Date.now() / 1000);
          const expiresIn = decodedToken.exp - currentTime;
          setSessionTimeLeft(expiresIn);
        }, 1000);
        
        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(interval);
      } catch (error) {
        // Manejo de errores
        console.error('Error al decodificar el token:', error);
      }
    }
  }, []);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <Typography variant='overline'>
      {sessionTimeLeft !== null && sessionTimeLeft >= 0 && (
        
            `Tiempo restante de sesión: ${formatTime(sessionTimeLeft)}` 
        
      )}
      
    </Typography>
  );
};

export default SessionTimer;
