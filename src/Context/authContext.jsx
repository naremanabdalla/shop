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
        password: password,
        createdAt: serverTimestamp(),
        favorite: [],
        cart: [],
        uid: uid,
      });
      console.log("Document written with ID: ", uid);
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
        console.log("Document data:", docSnap.data());
        return docSnap.data();
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.error("Error getting user: ", e);
      throw e;
    }
  };

  // const updateCart = async (userId, cartitem) => {
  //   try {
  //     const userRef = doc(db, "users", userId);
  //     await updateDoc(userRef, {
  //       cart: arrayUnion(cartitem),
  //     });
  //     console.log("Cart updated successfully");
  //   } catch (error) {
  //     console.error("Error updating cart:", error);
  //   }
  // };

  // const getCartItems = async (userId) => {
  //   try {
  //     const docRef = doc(db, "users", userId);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       console.log("Document data:", docSnap.data());
  //       return docSnap.data().cart; // Return the user data
  //     } else {
  //       console.log("No such document!");
  //     }
  //   } catch (e) {
  //     console.error("Error getting user: ", e);
  //     throw e;
  //   }
  // };

  return (
    <AuthProvider.Provider
      value={{
        currentUser,
        getUserFirestore,
        userLoggedIn,
        loading,
        addUserFirestore,
        // updateCart,
        // updateFavorite,
        // getCartItems,
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
