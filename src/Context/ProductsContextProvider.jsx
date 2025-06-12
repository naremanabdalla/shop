import React, { createContext, useEffect, useState } from "react";

export const ProductsContext = createContext();
const ProductsContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const categories = [
    "beauty",
    "womens-watches",
    "womens-shoes",
    "womens-jewellery",
    "womens-dresses",
    "womens-bags",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            const res = await fetch(
              `https://dummyjson.com/products/category/${category}`
            );
            const data = await res.json();
            return data.products;
          })
        );
        setProducts(results);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  return (
    <>
      <ProductsContext.Provider value={{ products, categories }}>
        {children}{" "}
      </ProductsContext.Provider>
    </>
  );
};

export default ProductsContextProvider;
