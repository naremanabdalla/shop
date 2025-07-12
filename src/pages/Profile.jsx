import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import { auth } from "../auth/firebse";
import Loading from "./Loading.jsx";
import NotFound from "./NotFound.jsx";

const Profile = () => {
  const { getUserFirestore, currentUser } = useAuth(); // Using the Auth context to get the current user
  const [user, setUser] = useState("");
  useEffect(() => {
    if (currentUser) {
      const fetchUser = async () => {
        try {
          const userData = await getUserFirestore(auth.currentUser?.uid);
          setUser(userData); // Now `user` contains { name, email, ... }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };

      fetchUser();
    }
  }, []);
  if (!currentUser) {
    return <NotFound />;
  }
  if (!user) {
    return <Loading />;
  }
  // const avatarLetter = user.name.charAt(0).toUpperCase();

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-10 text-gray-800">
        Profile Page
      </h1>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-lg flex flex-col items-center">
        {/* Avatar with first letter */}
        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
          {user.name.charAt(0).toUpperCase()}
        </div>
        {/* User name and email */}
        <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
        <p className="text-gray-600 mb-4">{user.email}</p>
        {/* Icons for favorites and cart */}
        <div className="flex space-x-8 mt-2">
          <Link to="/favourite" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 cursor-pointer">
              <FaHeart className="text-red-500 text-xl" />
              <span className="text-gray-700 font-medium">Favorites</span>
            </div>
          </Link>
          <Link to="/cart" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 cursor-pointer">
              <FaShoppingCart className="text-green-600 text-xl" />
              <span className="text-gray-700 font-medium">
                {user.cartCount} Cart
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
