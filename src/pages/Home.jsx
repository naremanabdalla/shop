import React, { useContext } from "react";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/SlideProducts/ProductCard";
import SlidProduct from "../components/SlideProducts/SlidProduct";
import { ProductsContext } from "../Context/ProductsContextProvider";
import Loading from "./Loading";
import PageTransation from "../components/PageTransation";
const Home = () => {
  const { products } = useContext(ProductsContext);
  if (!products || products.length === 0) {
    return <Loading />;
  }
  return (
    <>
      <HeroSlider />
      {products.map((product, index) => (
        <SlidProduct key={index} product={product} />
      ))}
    </>
  );
};

export default Home;
