import React, { useContext, useEffect, useState } from "react";
import { PiSignOutBold } from "react-icons/pi";
import { HiUserAdd } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ProductsContext } from "../../Context/ProductsContextProvider";
import { GiHamburgerMenu } from "react-icons/gi";
import { useAuth } from "../../Context/authContext";
import { doSignOut } from "../../auth/auth";
import { RxAvatar } from "react-icons/rx";
import { useTranslation } from "react-i18next";

const NavLinks = [
  { title: "Home", path: "/" },
  // { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

const BtmHeader = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { BrowseCategory } = useContext(ProductsContext);
  const [openMenue, setOpenMenue] = useState(false);

  const handleLogout = async () => {
    try {
      await doSignOut();
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  useEffect(() => {
    setOpenMenue(false);
  }, [location]);

  const { t } = useTranslation();

  return (
    <>
      <div
        className={`relative flex justify-between items-center bg-[color:var(--color-secondary)] text-[color:var(--color-primary)]  md:px-20 py-2 md:py-1  
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
{/* small screen */}
        <div
          className={`flex-col lg:hidden absolute top-8 w-full ${
            openMenue ? "flex" : "hidden"
          }`}
        >
          <div className=" text-center">
            <select
              defaultValue=""
              onChange={(e) => {
                navigate(
                  `/category/${e.target.value.replace(" ", "-").toLowerCase()}`
                );
              }}
              
            >
              <option value="" disabled hidden>
                {t("Browse Categories")}
              </option>
              {BrowseCategory.map((cat, index) => (
                <option value={cat} key={index} >
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className=" flex flex-col justify-between items-center gap-2 md:gap-6 lg:gap-8 xl:gap-10 pb-5 px-3">
            {NavLinks.map((link, index) => (
              <Link
                to={link.path}
                key={index}
                className={`text-xs text-center md:text-base hover:text-gray-800 rounded-sm transition-colors py-2 px-2 ${
                  location.pathname === link.path
                    ? "bg-gray-600 w-full text-pink-300 "
                    : ""
                }`}
              >
                {t(`${link.title}`)}
              </Link>
            ))}
          </div>
        </div>
{/* big screen */}
        <div className="hidden md:flex justify-between items-center gap-5">
          <div>
            <select
              defaultValue=""
              onChange={(e) => {
                navigate(
                  `/category/${e.target.value.replace(" ", "-").toLowerCase()}`
                );
              }}
            >
              <option value="" disabled hidden>
                                {t("Browse Categories")}

              </option>
              {BrowseCategory.map((cat, index) => (
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
                className={`w-auto text-xs md:text-base hover:text-[color:var(--color-primary)] transition-colors py-2 px-2 ${
                  location.pathname === link.path
                    ? "bg-gray-600 text-[color:var(--color-white)]"
                    : ""
                }`}
              >
              {t(`${link.title}`)}

              </Link>
            ))}
          </div>
        </div>
        {/*  */}
        <div className="flex justify-evenly items-center w-1/6 gap-2">
          {userLoggedIn ? (
            <>
              <PiSignOutBold
                className="cursor-pointer hover:text-gray-600"
                onClick={handleLogout}
                title="Sign Out"
              />
              <Link to={"/profile"}>
                <RxAvatar className="cursor-pointer hover:text-gray-600 text-xl" />
              </Link>
            </>
          ) : (
            <Link to="/signin">
              <HiUserAdd className="cursor-pointer hover:text-gray-600" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default BtmHeader;
