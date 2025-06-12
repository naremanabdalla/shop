import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext([]);
const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savecart = localStorage.getItem("cartItems");
    return savecart ? JSON.parse(savecart) : [];
  });
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, { ...item, count: 1 }]);
  };

  const icreaseProductinCart = (item) => {
    setCart(
      cart.map((ele) => {
        return ele.id == item.id
          ? {
              ...ele,
              count: ele.count + 1,
            }
          : ele;
      })
    );
  };
  const decreaseProductinCart = (item) => {
    setCart(
      cart.map((ele) => {
        return ele.id == item.id
          ? {
              ...ele,
              count: ele.count - 1,
            }
          : ele;
      })
    );
  };
  const removeProduct = (item) => {
    setCart(cart.filter((ele) => ele.id != item.id));
  };

  return (
    <>
      <CartContext.Provider
        value={{
          setCart,
          cart,
          addToCart,
          icreaseProductinCart,
          decreaseProductinCart,
          removeProduct,
        }}
      >
        {children}
      </CartContext.Provider>
    </>
  );
};

export default CartContextProvider;
