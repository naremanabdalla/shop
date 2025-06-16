import React, { useContext, useEffect, useState } from "react";
import { PiSignOutBold } from "react-icons/pi";
import { HiUserAdd } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ProductsContext } from "../../Context/ProductsContextProvider";
import { GiHamburgerMenu } from "react-icons/gi";

const NavLinks = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Accessories", path: "/accessories" },
  { title: "Blog", path: "/blog" },
  { title: "Contact", path: "/contact" },
];

const BtmHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { BrowseCategory } = useContext(ProductsContext);
  const [openMenue, setOpenMenue] = useState(false);
  // const [category, setCategory] = useState([]);

  // useEffect(() => {
  //   axios.get("https://dummyjson.com/products/categories").then((res) => {
  //     setCategory(res.data);
  //   });
  // }, []);

  useEffect(() => {
    setOpenMenue(false);
  }, [location]);
  return (
    <>
      <div
        className={`relative flex justify-between items-center bg-pink-400 text-white   md:px-20 py-2 md:py-1  
        `}
      >
        <div className="pl-5">
          <GiHamburgerMenu
            className={`md:hidden `}
            onClick={() => {
              setOpenMenue(!openMenue);
            }}
          />
        </div>

        <div
          className={`flex-col lg:hidden absolute bg-pink-400 top-8 w-full ${
            openMenue ? "flex" : "hidden"
          }`}
        >
          <div className=" text-center">
            <select
              defaultValue=""
              onChange={(e) => {
                // console.log(e.target.value.replace(" ", "-").toLowerCase());
                navigate(
                  `/category/${e.target.value.replace(" ", "-").toLowerCase()}`
                );
              }}
            >
              <option value="" disabled hidden>
                Browse Categories
              </option>
              {BrowseCategory.map((cat, index) => (
                // <Link to={`/ccat/${cat}`}>
                // <Link to={cat.name} key={index}>
                //   <div>{cat.name}</div>
                // </Link>
                // <Link to={`category/${cat.name}`} >
                <option value={cat} key={index} className="text-gray-700">
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className=" flex flex-col justify-between items-center gap-2 md:gap-6 lg:gap-8 xl:gap-10 ">
            {NavLinks.map((link, index) => (
              <Link
                to={link.path}
                key={index}
                className={`w-auto text-xs md:text-base hover:text-gray-800 transition-colors py-2 px-2 ${
                  location.pathname === link.path
                    ? "bg-gray-600 hover:text-pink-500"
                    : ""
                }`}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:flex justify-between items-center gap-5">
          <div>
            <select
              defaultValue=""
              onChange={(e) => {
                // console.log(e.target.value.replace(" ", "-").toLowerCase());
                navigate(
                  `/category/${e.target.value.replace(" ", "-").toLowerCase()}`
                );
              }}
            >
              <option value="" disabled hidden>
                Browse Categories
              </option>
              {BrowseCategory.map((cat, index) => (
                // <Link to={`/ccat/${cat}`}>
                // <Link to={cat.name} key={index}>
                //   <div>{cat.name}</div>
                // </Link>
                // <Link to={`category/${cat.name}`} >
                <option value={cat} key={index} className="text-gray-700">
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className=" flex justify-between items-center gap-2 md:gap-6 lg:gap-8 xl:gap-10 ">
            {NavLinks.map((link, index) => (
              <Link
                to={link.path}
                key={index}
                className={`w-auto text-xs md:text-base hover:text-gray-800 transition-colors py-2 px-2 ${
                  location.pathname === link.path
                    ? "bg-gray-600 hover:text-pink-500"
                    : ""
                }`}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex justify-evenly items-center w-1/6 gap-2">
          <PiSignOutBold />
          <HiUserAdd />
        </div>
      </div>
    </>
  );
};

export default BtmHeader;
