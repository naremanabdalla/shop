import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaUser } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { CartContext } from "../../Context/CartContextProvider";
import SearchPopup from "../../pages/SearchPopup";
import { GiBowTieRibbon } from "react-icons/gi";
import { FavouriteContext } from "../../Context/FavouriteContextprovider";
import { useAuth } from "../../Context/authContext";
import { IoLanguage } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const TopHeader = () => {
  const { cartCount } = useContext(CartContext);
  const { favoriteCount } = useContext(FavouriteContext);
  const { currentUser } = useAuth();
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(() => {
    const localLanguage = localStorage.getItem("language");
    return localLanguage ? localLanguage : "en";
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  }, [language]);
  return (
    <header className="bg-white ">
      <div className="container mx-auto px-4 md:px-2 lg:px-4 py-3 flex items-center justify-between gap-1">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <div className="flex gap-2 items-center">
            <GiBowTieRibbon className="text-3xl md:text-4xl text-pink-400" />
            <p className="text-gray-700 font-bold">shopping</p>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative flex items-center"></div>
        </div>
        {/* Navigation Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <p className="text-gray-500">{i18n.language}</p>
          <div>
            <IoLanguage
              onClick={() => {
                setLanguage(i18n.language == "ar" ? "en" : "ar");
              }}
              className="cursor-pointer text-md md:text-xl text-gray-700 hover:text-pink-500 transition-colors "
            />
          </div>

          <div className="flex flex-col items-center  text-gray-700 hover:text-blue-500 transition-colors relative">
            <SearchPopup className="text-md md:text-xl" />
          </div>

          <Link to={"/favourite"}>
            <div className="flex flex-col items-center text-gray-700 hover:text-pink-500 transition-colors relative">
              <FaRegHeart className="text-md md:text-xl" />
              <span className="absolute -top-3 -right-3 bg-pink-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {currentUser ? favoriteCount : 0}
              </span>
            </div>
          </Link>

          <Link to={"/cart"}>
            <button className="flex flex-col items-center text-gray-700 hover:text-pink-500 transition-colors relative">
              <HiOutlineShoppingCart className="text-md md:text-xl" />
              <span className="absolute -top-3 -right-3 bg-pink-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {currentUser ? cartCount : 0}
              </span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
