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
import ToastCart from "../../components/SlideProducts/ToastCart";
import ToastFavourite from "../../components/SlideProducts/ToastFavourite";
import StarRating from "../../components/StarRating";

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
      toast.success( <ToastCart item={item}/>
        ,{ duration: 3500 }
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
          <ToastFavourite item={item}/>,
                {
                  duration: 3500,
                  icon: (
                    <FaHeart
                      className={`${
                        i18n.language === "ar" ? "mr-1" : "-mr-4"
                      }  text-2xl text-[color:var(--color-secondary)]`}
                    />
                  ),
                  style: {
                    background:" var(--color-primary)",
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
      <h2 className="capitalize font-medium text-2xl md:text-4xl text-[color:var(--color-primary)] ">
        {item.title}
      </h2>
      <p className=" text-gray-600 mt-2 text-sm md:text-md">
        {item.description}
      </p>
      <div className=" mt-4 text-sm md:text-md">
        {item.brand && (
          <p className="text-[color:var(--color-secondary)] font-medium">
            Brand :<span className="text-[color:var(--color-primary)] "> {item.brand}</span>
          </p>
        )}
        <p className="text-[color:var(--color-secondary)] font-medium">
          Availability :{" "}
          <span className="text-[color:var(--color-primary)]">{item.availabilityStatus}</span>
        </p>
        <div className="flex text-sm text-yellow-500  my-2">
               <StarRating rating={item.rating} />
              </div>
        <div className="text-xl text-[color:var(--color-primary)] font-medium mt-4">
          ${item.price}
        </div>
      </div>
      <p className="text-[color:var(--color-secondary)] font-bold mt-4  text-sm md:text-lg">
        {t("Hurry Up! Only")} <span>{item.stock}</span>{" "}
        {t("products left in stock")}
      </p>
      <div className="flex  mt-4 items-center gap-3">
        <button
          className={` px-2 py-1 md:px-6 md:py-2 rounded-lg transition duration-300 ${
            isInCart
              ? "bg-gray-200 text-gray-600"
              : "bg-[color:var(--color-secondary)] text-white hover:bg-[color:var(--color-primary)]"
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
              className={` text-2xl cursor-pointer transition duration-300
                      ${isInFavourite ? "text-[color:var(--color-secondary)]" : ""}`}
            />
          ) : (
            <FaRegHeart className="text-2xl cursor-pointer hover:text-[color:var(--color-primary)] transition duration-300 text-[color:var(--color-secondary)]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
