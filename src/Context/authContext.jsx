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

  const getUserFirestore = async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No user document found, returning empty defaults");
        return {
          name: "",
          email: "",
          favorite: [], // Critical - ensures array methods won't fail
          cart: [], // Critical - ensures array methods won't fail
          uid: userId,
        };
      }
    } catch (e) {
      console.error("Error getting user: ", e);
      return {
        // Always return safe defaults on error
        name: "",
        email: "",
        favorite: [],
        cart: [],
        uid: userId,
      };
    }
  };

  async function initializeUser(user) {
    if (user) {
      try {
        // Always gets an object with safe defaults
        const userData = await getUserFirestore(user.uid);

        // Merge data
        setCurrentUser({
          ...user, // Auth data
          ...userData, // Firestore data (with safe arrays)
        });
        setUserLoggedIn(true);
      } catch (error) {
        console.error("Error initializing user:", error);
        setCurrentUser({
          ...user,
          favorite: [], // Explicit safe defaults
          cart: [],
        });
        setUserLoggedIn(true);
      }
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  const addUserFirestore = async (name, email, uid) => {
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
