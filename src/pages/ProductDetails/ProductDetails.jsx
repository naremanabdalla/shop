import React, { useContext, useEffect, useState } from "react";
import { ProductsContext } from "../../Context/ProductsContextProvider";
import { useParams } from "react-router-dom";
import SlidProduct from "../../components/SlideProducts/SlidProduct";
import Loading from "../Loading";
import ProductImg from "./ProductImg";
import ProductInfo from "./ProductInfo";
import PageTransation from "../../components/PageTransation";
import { useTranslation } from "react-i18next";
// import { useLocation } from "react-router-dom";

const ProductDetails = () => {
  // const location = useLocation();
  const { productID } = useParams();
  const { allProducts } = useContext(ProductsContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState([]);
const {t}=useTranslation()

  useEffect(() => {
    let CategoresProducts = allProducts.flat();

    setItem(
      ...CategoresProducts.filter((item) => {
        return item.id == productID;
      })
    );

    setLoading(false);

    setCategory(
      CategoresProducts.filter(
        (product) =>
          product.category === item?.category && product.id !== item?.id
      )
    );
  }, [productID, allProducts, item?.category, item?.id]);

  if (loading || !item) {
    return <Loading />;
  }

  if (!item.images || !item.images.length) {
    return <div>{t("No images available")}</div>;
  }

  return (
    <>
      {/* <PageTransation key={location.key}> */}
      <div className=" flex  flex-wrap md:flex-nowrap items-center justify-center md:p-20  gap-10 mx-auto">
        <ProductImg item={item} />
        <ProductInfo item={item} />
      </div>
      <div>
        <h2 className="capitalize font-medium text-4xl text-center mt-4 text-pink-500">
          {item.category.replace("-", " ")}
        </h2>
      </div>
      <SlidProduct product={category} />
      {/* </PageTransation> */}
    </>
  );
};

export default ProductDetails;
