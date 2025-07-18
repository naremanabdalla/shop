import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CartContext } from "../../Context/CartContextProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../../Context/authContext";
import { FavouriteContext } from "../../Context/FavouriteContextprovider";
import { useTranslation } from "react-i18next";

const ProductInfo = ({ item }) => {
  const { productID } = useParams();
  const { addToCart, getCartItems } = useContext(CartContext);
  const { getFavoriteItems, addToFavourite } = useContext(FavouriteContext);
  const { currentUser } = useAuth(); // Using the Auth context to get the current user

  const [isInCart, setIsInCart] = useState(false);
  const [isInFavourite, setIsInFavourite] = useState(false);
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
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
  }, [getFavoriteItems, productID, getCartItems, item, currentUser?.uid]);
  const handelAddToCart = async () => {
    if (currentUser) {
      addToCart(currentUser.uid, item);
      const updatedCart = await getCartItems(currentUser.uid);
      setIsInCart(updatedCart.some((ele) => ele.id === item.id));
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
        { duration: 2500 }
      );
    } else {
      toast.error(t("Please sign in to add to cart"));
      navigate("/signin");
    }
  };

  const handelFavourite = async () => {
    if (currentUser) {
      addToFavourite(currentUser.uid, item);
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
          <div></div>
        </div>,
        {
          duration: 2500,
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
      toast.error(t("Please sign in to add to favourites"));
      navigate("/signin");
    }
  };

  return (
    <div className="w-1/2 flex flex-col justify-center items-start">
      <h2 className="capitalize font-medium text-2xl md:text-4xl text-pink-500 ">
        {item.title}
      </h2>
      <p className=" text-gray-600 mt-2 text-sm md:text-md">
        {item.description}
      </p>
      <div className=" mt-4 text-sm md:text-md">
        {item.brand && (
          <p className="text-gray-600 font-medium">
            Brand :<span className="text-pink-500 "> {item.brand}</span>
          </p>
        )}
        <p className="text-gray-600 font-medium">
          Availability :{" "}
          <span className="text-pink-500">{item.availabilityStatus}</span>
        </p>
        <div className="flex text-sm text-yellow-500  my-2">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
        </div>
        <div className="text-xl text-pink-400 font-medium mt-4">
          ${item.price}
        </div>
      </div>
      <p className="text-gray-600 font-bold mt-4  text-sm md:text-lg">
        {t("Hurry Up! Only")} <span>{item.stock}</span>{" "}
        {t("products left in stock")}
      </p>
      <div className="flex  mt-4 items-center gap-3">
        <button
          className={` px-2 py-1 md:px-6 md:py-2 rounded-lg transition duration-300 ${
            isInCart
              ? "bg-gray-200 text-gray-600"
              : "bg-pink-500 text-white hover:bg-pink-600"
          }`}
          onClick={() => {
            handelAddToCart();
          }}
          disabled={isInCart}
        >
          {isInCart ? `${t(`Added to Cart`)}` : `${t(`Add to Cart`)}`}{" "}
          <GiShoppingCart className="inline-block ml-2" />
        </button>
        <button disabled={isInFavourite} onClick={handelFavourite}>
          {isInFavourite ? (
            <FaHeart
              className={` text-2xl cursor-pointer hover:text-pink-600 transition duration-300
                      ${isInFavourite ? "text-pink-500" : ""}`}
            />
          ) : (
            <FaRegHeart className="text-2xl cursor-pointer hover:text-pink-600 transition duration-300 text-pink-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
