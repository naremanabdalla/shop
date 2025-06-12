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
    <>
      <p className="text-center text-pink-500 font-bold text-4xl ">Cart</p>
      {cart.length == 0 ? (
        <div className="text-center mt-4 text-gray-700  text-xl font-bold">
          Your cart is empty
        </div>
      ) : (
        <div className="p-10 px-20">
          <div className="border border-gray-300 rounded-md shadow-md text-gray-700 ">
            {cart.map((item, index) => (
              <div className=" " key={index}>
                <div className="flex gap-10 items-center justify-center">
                  <img src={item.thumbnail} alt="" className="h-24 " />
                  <div className="w-1/2">
                    <div className="flex justify-between items-center">
                      <h2 className="font-medium text-pink-400 mb-3">
                        {item.title}
                      </h2>
                      <HiOutlineTrash
                        className=" text-gray-800 text-lg cursor-pointer"
                        onClick={() => {
                          removeProduct(item);
                        }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <button
                          className=" rounded-xl bg-gray-200 text-pink-400  font-bold px-2 pb-1"
                          onClick={() => {
                            item.count < 2
                              ? removeProduct(item)
                              : decreaseProductinCart(item);
                          }}
                        >
                          -
                        </button>
                        <span className="">{item.count || 1}</span>
                        <button
                          className="rounded-xl bg-gray-200 text-pink-400  font-bold px-1 pb-1"
                          onClick={() => {
                            icreaseProductinCart(item);
                          }}
                        >
                          +
                        </button>
                      </div>
                      <span>${item.price * (item.count || 1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-1/3 bg-pink-400 flex justify-between py-1 px-8 rounded-2xl my-6 mt-16 mx-auto text-gray-800 font-medium  hover:bg-pink-500">
              <span>Checkout</span>{" "}
              <span>
                {cart.reduce(
                  (acc, item) => acc + item.price * (item.count || 1),
                  0
                )}
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
