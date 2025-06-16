import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext([]);
const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savecart = localStorage.getItem("cartItems");
    return savecart ? JSON.parse(savecart) : [];
  });
  const [favourite, setFavourite] = useState(() => {
    const savefavourite = localStorage.getItem("favouriteItems");
    return savefavourite ? JSON.parse(savefavourite) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, { ...item, count: 1 }]);
  };

  //add product to favourite
  useEffect(() => {
    localStorage.setItem("favouriteItems", JSON.stringify(favourite));
  }, [favourite]);
  const addToFavourite = (item) => {
    setFavourite((prevfavourite) => [...prevfavourite, { ...item }]);
  };

  //increase quantity
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
  //decrease quantity
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
  //remove product from cart
  const removeProduct = (item) => {
    setCart(cart.filter((ele) => ele.id != item.id));
  };
  //remove product from favourite
  const removeFavourite = (item) => {
    setFavourite(favourite.filter((ele) => ele.id != item.id));
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
          addToFavourite,
          favourite,
          removeFavourite,
        }}
      >
        {children}
      </CartContext.Provider>
    </>
  );
};

export default CartContextProvider;
