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
      try {
        // First get Firestore data (or create if new user)
        let userData = await getUserFirestore(user.uid);

        // If no document exists, create one
        if (!userData.name) {
          // Check if we got the default empty object
          await addUserFirestore(
            user.displayName || "New User",
            user.email,
            "", // No password in Firestore
            user.uid
          );
          userData = await getUserFirestore(user.uid); // Get the newly created data
        }

        // Merge auth data with Firestore data
        setCurrentUser({
          ...user, // Auth data (uid, email, displayName, etc.)
          ...userData, // Firestore data (favorite, cart, etc.)
        });
        setUserLoggedIn(true);
      } catch (error) {
        console.error("Error initializing user:", error);
        // Fallback to auth-only data with safe defaults
        setCurrentUser({
          ...user,
          favorite: [],
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
