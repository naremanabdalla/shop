import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const ProductsContext = createContext();
const ProductsContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllproducts] = useState([]);
  const categories = [
    "beauty",
    "womens-watches",
    "womens-shoes",
    "womens-jewellery",
    "womens-dresses",
    "womens-bags",
  ];
  const BrowseCategory = [
    "beauty",
    "womens-watches",
    "womens-shoes",
    "womens-jewellery",
    "womens-dresses",
    "womens-bags",
    "mens-shirts",
    "mens-shoes",
    "skin-care",
    "sunglasses",
    "tops",
    "fragrances",
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

    BrowseCategory.map((cat) => {
      axios
        .get(`https://dummyjson.com/products/category/${cat}`)
        .then((res) => {
          setAllproducts((olddata) => [...olddata, res.data.products]);
        });
    });
  }, []);
  return (
    <>
      <ProductsContext.Provider
        value={{ products, categories, allProducts, BrowseCategory }}
      >
        {children}{" "}
      </ProductsContext.Provider>
    </>
  );
};

export default ProductsContextProvider;
