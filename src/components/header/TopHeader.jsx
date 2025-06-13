import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import { IoSearch } from "react-icons/io5";
import { FaRegHeart, FaUser } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { CartContext } from "../../Context/CartContextProvider";
import SearchPopup from "../../pages/SearchPopup";
const TopHeader = () => {
  const { cart } = useContext(CartContext);
  return (
    <header className="bg-white ">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img src={logo} alt="Company Logo" className="h-10" />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative flex items-center">
            {/* <input
              type="text"
              placeholder="Search for products"
              className="w-full py-2 pl-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="flex bg-blue-500 text-white p-2 rounded-lg absolute right-0 top-0 h-full items-center justify-center hover:bg-blue-600 transition-colors"
            >
              <span>search</span> */}
            {/* </button> */}
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition-colors relative">
            {/* <IoSearch className="text-lg" /> */}
            <SearchPopup />
          </div>
          <div className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition-colors relative">
            <FaRegHeart className="text-xl" />
            <span className="absolute -top-3 -right-3 bg-pink-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </div>

          <Link to={"/cart"}>
            <button className="flex flex-col items-center text-gray-700 hover:text-blue-500 transition-colors relative">
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
