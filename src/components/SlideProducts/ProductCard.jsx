import React, { useContext, useEffect, useState } from "react";

import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { FaRegHeart } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProductDetailsLoading from "../../pages/Loading";
import { CartContext } from "../../Context/CartContextProvider";
import { FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const ProductCard = ({ item }) => {
  const { addToCart, cart } = useContext(CartContext);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    setIsInCart(
      cart.some((ele) => {
        return ele.id == item.id;
      })
    );
  }, [cart, item]);

  // const handelClick = () => {
  //   cart.map((ele) => {
  //     ele.id == item.id ? setisInCart(true) : setisInCart(false);
  //   });
  // };

  if (!item || !item.thumbnail) {
    return <ProductDetailsLoading />;
  }
  const handelAddToCart = () => {
    addToCart(item);
    toast.success(
      <div className="flex gap-2 items-center justify-between">
        <img src={item.thumbnail} alt="" className="h-15" />

        <div className="text-sm">
          <p>{item.title}</p>
          added to cart
        </div>
        <div>
          <Link to="/cart">
            <button className="bg-pink-400 text-sm rounded-md px-1 py-1">
              View Cart
            </button>
          </Link>
        </div>
      </div>,
      { duration: 1500 }
    );
  };
  return (
    <>
      <div className="group shadow-xl rounded-md border border-gray-200 pb-3 pt-4 relative hover:border hover:border-gray-400">
        <p
          className={`text-center font-medium text-pink-400 flex justify-center items-center gap-2 absolute  right-1/3  transition-all duration-300 ease-in-out ${
            isInCart ? "opacity-100 top-2" : "-top-2 opacity-0"
          }`}
        >
          <FaCheckCircle className="text-green-500" />
          In the cart
        </p>
        <div className="flex justify-between items-center">
          <Link to={`/product/${item.id}`}>
            <div className="px-3">
              {" "}
              <div>
                <img src={item.thumbnail} alt="" />
                {/* <div className="swiper-lazy-preloader"></div> */}
                {/* <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div> */}
              </div>
              <p className="px-2 line-clamp-1  ">{item.title}</p>
              <div className="px-2 flex text-sm text-yellow-500  my-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
              </div>
              <p className=" px-2 text-md text-pink-400 font-medium">
                ${item.price}
              </p>
            </div>
          </Link>

          <div
            className={`text-pink-500 absolute top-15 flex flex-col gap-2 -right-2 opacity-0 transition-all  duration-300 ease-in-out group-hover:right-3 group-hover:opacity-100 
              `}
            // ${isInCart ? "pointer-events-none" : ""}
          >
            <button disabled={isInCart}>
              <GiShoppingCart
                className={` rounded-lg text-md p-1 box-content cursor-pointer ${
                  isInCart ? " bg-pink-400 text-gray-500" : " bg-gray-200"
                } `}
                onClick={() => {
                  handelAddToCart();
                }}
              />
            </button>
            <FaRegHeart className="bg-gray-200 rounded-lg text-md p-1 box-content  cursor-pointer" />
            <FaShare className="bg-gray-200 rounded-lg text-md p-1 box-content  cursor-pointer" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
