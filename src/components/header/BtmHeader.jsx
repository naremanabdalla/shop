import React, { useEffect, useState } from "react";
import { PiSignOutBold } from "react-icons/pi";
import { HiUserAdd } from "react-icons/hi";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [category, setCategory] = useState([]);
  useEffect(() => {
    axios.get("https://dummyjson.com/products/categories").then((res) => {
      setCategory(res.data);
    });
  }, []);
  return (
    <>
      <div className="flex justify-between items-center bg-pink-400 text-white  md:px-20">
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
            {category.map((cat, index) => (
              // <Link to={`/ccat/${cat}`}>
              // <Link to={cat.name} key={index}>
              //   <div>{cat.name}</div>
              // </Link>
              // <Link to={`category/${cat.name}`} >
              <option value={cat.name} key={index} className="text-gray-700">
                {cat.name}
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
        <div className="flex justify-evenly items-center w-1/16">
          <PiSignOutBold />
          <HiUserAdd />
        </div>
      </div>
    </>
  );
};

export default BtmHeader;
