import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { createContext, useState } from "react";
import { db } from "../auth/firebse";

export const FavouriteContext = createContext([]);

export default function FavouriteContextprovider({ children }) {
  const [favoriteCount, setFavoriteCount] = useState(0);
  // const [favourite, setFavourite] = useState(() => {
  // const savefavourite = localStorage.getItem("favouriteItems");
  // return savefavourite ? JSON.parse(savefavourite) : [];
  // });

  //add product to favourite
  // useEffect(() => {
  //   localStorage.setItem("favouriteItems", JSON.stringify(favourite));
  // }, [favourite]);

  const addToFavourite = async (userId, favouriteItem) => {
    // setFavourite((prevfavourite) => [...prevfavourite, { ...item }]);
    try {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, {
        favorite: arrayUnion(favouriteItem),
      });
      console.log("favorite updated successfully");
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const getFavoriteItems = async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data().cart);
        const favorite = docSnap.data().favorite || [];
        setFavoriteCount(favorite.length); // Update the count when fetching
        return favorite; // Return the user data
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.error("Error getting user: ", e);
      throw e;
    }
  };

  const removeFavourite = async (userId, favoriteItem) => {
    // setFavourite(favourite.filter((ele) => ele.id != item.id));
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    const favorite = docSnap.data().favorite;
    try {
      await updateDoc(docRef, {
        favorite: favorite.filter((ele) => ele.id !== favoriteItem.id),
      });
      setFavoriteCount(favorite.length - 1);
      console.log("favorite updated successfully");
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };
  return (
    <>
      <FavouriteContext.Provider
        value={{
          addToFavourite,
          removeFavourite,
          favoriteCount,
          getFavoriteItems,
        }}
      >
        {children}
      </FavouriteContext.Provider>
    </>
  );
}
