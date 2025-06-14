import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart, FaUser } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { CartContext } from "../../Context/CartContextProvider";
import SearchPopup from "../../pages/SearchPopup";
import { GiBowTieRibbon } from "react-icons/gi";

const TopHeader = () => {
  const { cart, favourite } = useContext(CartContext);
  return (
    <header className="bg-white ">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <div className="flex gap-2 items-center">
            <GiBowTieRibbon className="text-4xl text-pink-400" />
            <p className="text-gray-700 font-bold">shopping</p>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative flex items-center"></div>
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition-colors relative">
            {/* <IoSearch className="text-lg" /> */}
            <SearchPopup />
          </div>

          <Link to={"/favourite"}>
            <div className="flex flex-col items-center text-gray-700 hover:text-pink-500 transition-colors relative">
              <FaRegHeart className="text-xl" />
              <span className="absolute -top-3 -right-3 bg-pink-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {favourite.length}
              </span>
            </div>
          </Link>

          <Link to={"/cart"}>
            <button className="flex flex-col items-center text-gray-700 hover:text-pink-500 transition-colors relative">
              <HiOutlineShoppingCart className="text-xl" />
              <span className="absolute -top-3 -right-3 bg-pink-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
