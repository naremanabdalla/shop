import React, { useContext } from "react";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/SlideProducts/ProductCard";
import SlidProduct from "../components/SlideProducts/SlidProduct";
import { ProductsContext } from "../Context/ProductsContextProvider";
import Loading from "./Loading";
import PageTransation from "../components/PageTransation";
// import { useLocation } from "react-router-dom";
const Home = () => {
  // const location = useLocation();
  const { products } = useContext(ProductsContext);
  if (!products || products.length === 0) {
    return <Loading />;
  }
  return (
    <>
      {/* <PageTransation key={location.key}> */}
      <HeroSlider />
      {products.map((product, index) => (
        <SlidProduct key={index} product={product} />
      ))}
      {/* </PageTransation> */}
    </>
  );
};

export default Home;
