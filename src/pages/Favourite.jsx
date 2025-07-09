import React, { useContext, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FavouriteContext } from "../Context/FavouriteContextprovider";
import { useAuth } from "../Context/authContext";

const Favourite = () => {
  const { getFavoriteItems, removeFavourite } = useContext(FavouriteContext);
  const [favourite, setFavourite] = useState([]);

  const { currentUser } = useAuth();
  useEffect(() => {
    getFavoriteItems(currentUser.uid)
      .then((data) => {
        setFavourite(data);
        console.log("Cart items fetched:", data);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }, [getFavoriteItems, currentUser.uid]);

  const handelRemoveItemFromCart = async (item) => {
    removeFavourite(currentUser.uid, item);
    const updatedFavourite = await getFavoriteItems(currentUser.uid);
    setFavourite(updatedFavourite.filter((ele) => ele.id !== item.id));
  };
  if (!favourite) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <h2 className="text-center text-pink-500 font-bold text-2xl sm:text-3xl md:text-4xl py-4">
        Your Favourites
      </h2>

      {favourite.length === 0 ? (
        <div className="text-center mt-8 text-gray-700 text-lg sm:text-xl font-bold">
          No Favourite Prodect Yet
        </div>
      ) : (
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="border border-gray-300 rounded-lg shadow-sm sm:shadow-md">
            {favourite.map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-200 last:border-b-0 p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-center">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                  />

                  <div className="w-full sm:w-auto flex-1">
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <h2 className="font-medium text-pink-400 text-sm sm:text-base md:text-lg line-clamp-2">
                        {item.title}
                      </h2>
                      <button
                        onClick={() => handelRemoveItemFromCart(item)}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <FaHeart
                          className={`text-lg sm:text-xl cursor-pointer text-pink-400 `}
                        />
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-gray-700">
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourite;
