import React, { useContext, useEffect, useState } from "react";

import { FaShare, FaHeart, FaRegHeart, FaCheckCircle } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import ProductDetailsLoading from "../../pages/Loading";
import { CartContext } from "../../Context/CartContextProvider";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/authContext";
import { FavouriteContext } from "../../Context/FavouriteContextprovider";
import { useTranslation } from "react-i18next";
import StarRating from "../StarRating";
import ToastCart from "./ToastCart";
import ToastFavourite from "./ToastFavourite";

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
            Array.isArray(data) && data.some((ele) => ele.id == item.id)
          );
        })
        .catch((err) => {
          console.log(err);
          setIsInCart(false); // Default to false on error
        });

      getFavoriteItems(currentUser.uid)
        .then((data) => {
          setIsInFavourite(
            Array.isArray(data) && data.some((ele) => ele.id == item.id)
          );
        })
        .catch((err) => {
          console.log(err);
          setIsInFavourite(false); // Default to false on error
        });
    }
  }, [getCartItems, item, getFavoriteItems, currentUser?.uid, currentUser]);

  if (!item || !item.thumbnail) {
    return <ProductDetailsLoading />;
  }
  const handelAddToCart = async () => {
    if (currentUser) {
      await addToCart(currentUser.uid, item);
      const updatedCart = await getCartItems(currentUser.uid);
      setIsInCart(
        Array.isArray(updatedCart) &&
          updatedCart.some((ele) => ele.id === item.id)
      );
      toast.success(<ToastCart item={item} />, { duration: 3500 });
    } else {
      toast.error(t("Please sign in to add to cart"));
      navigate("/signin");
    }
  };

  const handelFavourite = async () => {
    if (currentUser) {
      await addToFavourite(currentUser.uid, item);
      const updatedFavourite = await getFavoriteItems(currentUser.uid);
      setIsInFavourite(
        Array.isArray(updatedFavourite) &&
          updatedFavourite.some((ele) => ele.id === item.id)
      );
      toast.success(<ToastFavourite item={item} />, {
        duration: 3500,
        icon: (
          <FaHeart
            className={`${
              i18n.language === "ar" ? "mr-1" : "-mr-4"
            } text-2xl text-[color:var(--color-secondary)]`}
          />
        ),
        style: { background: "var(--color-primary)" },
      });
    } else {
      toast.error(t("Please sign in to add to favourites"));
      navigate("/signin");
    }
  };

  const handleShare = () => {
    const productUrl = `https://shopping022.netlify.app/product/${item.id}`;

    navigator.clipboard
      .writeText(productUrl)
      .then(() => {
        toast.success(t("Link copied to clipboard!"), {
          duration: 2000,
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error(t("Failed to copy link"), {
          duration: 2000,
        });
      });
  };
  return (
    <>
      <div className="group shadow-xl rounded-md border border-gray-200 pb-5 mb-10 pt-4 relative hover:border hover:border-gray-400">
        <p
          className={`text-center font-medium text-[color:var(--color-secondary)] flex justify-center items-center gap-2 absolute  transition-all duration-300 ease-in-out ${
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
                <StarRating rating={item.rating} />
              </div>
              <p className=" px-2 text-md text-[color:var(--color-secondary)] font-medium">
                ${item.price}
              </p>
            </div>
          </Link>

          <div
            className={`text-[color:var(--color-secondary)] absolute top-15 flex flex-col gap-2 -right-2 opacity-0 transition-all  duration-300 ease-in-out group-hover:right-3 group-hover:opacity-100 
              `}
          >
            <button disabled={isInCart}>
              <GiShoppingCart
                className={`hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-secondary)] rounded-lg text-md p-1 box-content cursor-pointer ${
                  isInCart
                    ? " bg-[color:var(--color-primary)] text-[color:var(--color-secondary)]"
                    : " bg-gray-200"
                } `}
                onClick={() => {
                  handelAddToCart();
                }}
              />
            </button>
            <button disabled={isInFavourite}>
              <FaRegHeart
                className={`hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-secondary)] rounded-lg text-md p-1 box-content cursor-pointer
                ${
                  isInFavourite
                    ? "bg-[color:var(--color-primary)] text-[color:var(--color-secondary)]"
                    : "bg-gray-200"
                }`}
                onClick={handelFavourite}
              />
            </button>
            <button onClick={handleShare}>
              <FaShare className="hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-secondary)] bg-gray-200 rounded-lg text-md p-1 box-content  cursor-pointer" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
