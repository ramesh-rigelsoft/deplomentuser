import React, { createContext, useContext, useState, useEffect } from 'react';

// Context create karein
const SecretKeyContext = createContext();

export const SecretKeyProvider = ({ children }) => {
  // LocalStorage se initial key load karein (agar pehle se saved ho)
  const [secretKey, setSecretKey] = useState(() => {
    return localStorage.getItem('app_secret_key') || 'AIzaSyDHsgyi4D4aOy5td8h0I7SsRgQ2pKfbsAk';
  });

  // Jab bhi key change ho, localStorage me update kar dein
//   useEffect(() => {
//     if (secretKey) {
//       localStorage.setItem('app_secret_key', secretKey);
//     } else {
//       localStorage.removeItem('app_secret_key');
//     }
//   }, [secretKey]);

  return (
    <SecretKeyContext.Provider value={{ secretKey, setSecretKey }}>
      {children}
    </SecretKeyContext.Provider>
  );
};

// Custom hook kahin bhi use karne ke liye
export const useSecretKey = () => {
  const context = useContext(SecretKeyContext);
  if (!context) {
    throw new Error('useSecretKey must be used within a SecretKeyProvider');
  }
  return context;
};