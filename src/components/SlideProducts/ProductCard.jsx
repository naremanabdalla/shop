import React, { useContext, useEffect, useState } from "react";

import {
  FaStar,
  FaStarHalfAlt,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaCheckCircle,
} from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import ProductDetailsLoading from "../../pages/Loading";
import { CartContext } from "../../Context/CartContextProvider";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/authContext";
import { FavouriteContext } from "../../Context/FavouriteContextprovider";
import { useTranslation } from "react-i18next";

const ProductCard = ({ item }) => {
  const { addToCart, getCartItems } = useContext(CartContext);
  const { addToFavourite, getFavoriteItems } = useContext(FavouriteContext);
  const [isInCart, setIsInCart] = useState(false);
  const [isInFavourite, setIsInFavourite] = useState(false);
  const { currentUser } = useAuth(); // Using the Auth context to get the current user
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      getCartItems(currentUser.uid)
        .then((data) => {
          setIsInCart(
            data.some((ele) => {
              return ele.id == item.id;
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
      getFavoriteItems(currentUser.uid)
        .then((data) => {
          setIsInFavourite(
            data.some((ele) => {
              return ele.id == item.id;
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [getCartItems, item, getFavoriteItems, currentUser?.uid, currentUser]);

  if (!item || !item.thumbnail) {
    return <ProductDetailsLoading />;
  }
  const handelAddToCart = async () => {
    if (currentUser) {
      addToCart(currentUser.uid, item);
      const updatedCart = await getCartItems(currentUser.uid);
      setIsInCart(updatedCart.some((ele) => ele.id === item.id));
      toast.success(
        <div className="">
          <div className="flex gap-3 items-center justify-between font-medium">
            <img src={item.thumbnail} alt="" className="h-15" />

            <div className="">
              <div className="text-sm w-full flex">
                <p>
                  {item.title}{" "}
                  <span className="text-sm"> {t("added to cart")}</span>
                </p>
              </div>

              <Link to="/cart">
                <button className="bg-pink-400 text-sm rounded-md px-1 py-1 mt-1">
                  {t("View Cart")}
                </button>
              </Link>
            </div>
          </div>
        </div>,
        { duration: 3500 }
      );
    } else {
      // Handle case where user isn't logged in
      toast.error(t("Please sign in to add to cart"));

      navigate("/signin");
    }
  };
  const handelFavourite = async () => {
    if (currentUser) {
      addToFavourite(currentUser.uid, item); // Pass user ID and item
      const updatedFavourite = await getFavoriteItems(currentUser.uid);
      setIsInFavourite(updatedFavourite.some((ele) => ele.id === item.id));
      toast.success(
        <div className="flex gap-2 items-center justify-between text-gray-800 font-medium">
          <img src={item.thumbnail} alt="" className="h-15" />
          <div className="text-sm">
            <p>
              {item.title} <span> {t("added to Favourite")}</span>
            </p>
          </div>
        </div>,
        {
          duration: 3500,
          icon: (
            <FaHeart
              className={`${
                i18n.language === "ar" ? "mr-1" : "-mr-4"
              }  text-2xl text-pink-500`}
            />
          ),
          style: {
            background: "pink",
          },
        }
      );
    } else {
      // Handle case where user isn't logged in
      toast.error(t("Please sign in to add to favourites"));
      navigate("/signin");
    }
  };
  return (
    <>
      <div className="group shadow-xl rounded-md border border-gray-200 pb-5 mb-10 pt-4 relative hover:border hover:border-gray-400">
        <p
          className={`text-center font-medium text-pink-400 flex justify-center items-center gap-2 absolute  transition-all duration-300 ease-in-out ${
            isInCart ? "opacity-100 top-2" : "-top-2 opacity-0"
          } ${i18n.language === "ar" ? "right-1/5" : "right-1/3"}`}
        >
          <FaCheckCircle className="text-green-500" />
          {t("In the cart")}
        </p>
        <div className="flex justify-between items-center">
          <Link to={`/product/${item.id}`}>
            <div className="px-3">
              {" "}
              <div>
                <img src={item.thumbnail} alt="" />
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
            <button disabled={isInFavourite}>
              <FaRegHeart
                className={`rounded-lg text-md p-1 box-content cursor-pointer
                ${isInFavourite ? "bg-pink-400 text-gray-500" : "bg-gray-200"}`}
                onClick={handelFavourite}
              />
            </button>
            <FaShare className="bg-gray-200 rounded-lg text-md p-1 box-content  cursor-pointer" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
