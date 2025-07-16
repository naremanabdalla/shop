import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../auth/firebse";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

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

  const addUserFirestore = async (name, email, password, uid) => {
    try {
      await setDoc(doc(db, "users", uid), {
        name: name,
        email: email,
        createdAt: serverTimestamp(),
        favorite: [],
        cart: [],
        uid: uid,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  };

  const getUserFirestore = async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
        return { favorite: [], cart: [] }; // Return empty object with default arrays
      }
    } catch (e) {
      console.error("Error getting user: ", e);
      return { favorite: [], cart: [] }; // Even on error, return safe default
    }
  };

  return (
    <AuthProvider.Provider
      value={{
        currentUser,
        getUserFirestore,
        userLoggedIn,
        loading,
        addUserFirestore,
      }}
    >
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
