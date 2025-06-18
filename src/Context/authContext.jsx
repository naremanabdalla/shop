import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../auth/firebse";
import { onAuthStateChanged } from "firebase/auth";

export const AuthProvider = createContext();

const AuthContext = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      setCurrentUser(user);
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }
  return (
    <AuthProvider.Provider value={{ currentUser, userLoggedIn, loading }}>
      {children}
    </AuthProvider.Provider>
  );
};
// Create the custom hook
export const useAuth = () => {
  const context = useContext(AuthProvider);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export default AuthContext;
