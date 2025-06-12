import React, { useContext } from "react";
import Loading from "./Loading";
import { HiOutlineTrash } from "react-icons/hi2";
import { CartContext } from "../Context/CartContextProvider";

const Cart = () => {
  const { cart, icreaseProductinCart, decreaseProductinCart, removeProduct } =
    useContext(CartContext);

  if (!cart) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <h2 className="text-center text-pink-500 font-bold text-2xl sm:text-3xl md:text-4xl py-4">
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <div className="text-center mt-8 text-gray-700 text-lg sm:text-xl font-bold">
          Your cart is empty
        </div>
      ) : (
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="border border-gray-300 rounded-lg shadow-sm sm:shadow-md">
            {cart.map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-200 last:border-b-0 p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-center">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                  />

                  <div className="w-full sm:w-auto flex-1">
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <h2 className="font-medium text-pink-400 text-sm sm:text-base md:text-lg line-clamp-2">
                        {item.title}
                      </h2>
                      <button
                        onClick={() => removeProduct(item)}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <HiOutlineTrash className="text-lg sm:text-xl" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button
                          className="w-8 h-8 rounded-lg bg-gray-200 text-pink-400 font-bold flex items-center justify-center hover:bg-gray-300 transition-colors"
                          onClick={() =>
                            item.count < 2
                              ? removeProduct(item)
                              : decreaseProductinCart(item)
                          }
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">
                          {item.count || 1}
                        </span>
                        <button
                          className="w-8 h-8 rounded-lg bg-gray-200 text-pink-400 font-bold flex items-center justify-center hover:bg-gray-300 transition-colors"
                          onClick={() => icreaseProductinCart(item)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-medium text-gray-800">
                        ${(item.price * (item.count || 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">
                  $
                  {cart
                    .reduce(
                      (acc, item) => acc + item.price * (item.count || 1),
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>

              <button className="w-full sm:w-1/2 md:w-1/3 bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 px-6 rounded-xl mx-auto flex justify-between items-center transition-colors">
                <span>Checkout</span>
                <span>
                  $
                  {cart
                    .reduce(
                      (acc, item) => acc + item.price * (item.count || 1),
                      0
                    )
                    .toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
