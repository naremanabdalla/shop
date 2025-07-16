import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { createContext, useCallback, useState } from "react";
import { db } from "../auth/firebse";

export const CartContext = createContext([]);
const CartContextProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = async (userId, cartitem) => {
    try {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, {
        cart: arrayUnion({ ...cartitem, count: 1 }),
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const getCartItems = async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const cart = docSnap.data().cart || [];
        setCartCount(cart.length);
        return cart;
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (e) {
      console.error("Error getting user: ", e);
      throw e;
    }
  };

  //remove product from cart
  const removeItemFromCart = async (userId, cartitem) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      const cart = docSnap.data().cart;
      await updateDoc(docRef, {
        cart: cart.filter((ele) => ele.id !== cartitem.id),
      });
      setCartCount(cart.length - 1);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const icreaseProductinCart = useCallback(async (userId, cartitem) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      const cart = docSnap.data().cart || [];
      const updateProductinCart = cart.map((ele) => {
        return ele.id == cartitem.id
          ? {
              ...ele,
              count: ele.count + 1,
            }
          : ele;
      });
      await updateDoc(docRef, {
        cart: updateProductinCart,
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  }, []); // Empty dependency array = stable function
  const decreaseProductinCart = useCallback(async (userId, cartitem) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      const cart = docSnap.data().cart;
      let updateProductinCart = cart.map((ele) => {
        return ele.id == cartitem.id
          ? {
              ...ele,
              count: ele.count - 1,
            }
          : ele;
      });
      // Remove item if count reaches 0 (optional)
      updateProductinCart = updateProductinCart.filter(
        (item) => item.count > 0
      );

      await updateDoc(docRef, {
        cart: updateProductinCart,
      });
      setCartCount(updateProductinCart.length);
      return updateProductinCart;
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  }, []);

  return (
    <>
      <CartContext.Provider
        value={{
          addToCart,
          getCartItems,
          removeItemFromCart,
          cartCount,
          icreaseProductinCart,
          decreaseProductinCart,
        }}
      >
        {children}
      </CartContext.Provider>
    </>
  );
};

export default CartContextProvider;
