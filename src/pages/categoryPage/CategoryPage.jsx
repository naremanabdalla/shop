import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SlidProduct from "../../components/SlideProducts/SlidProduct";
import { ProductsContext } from "../../Context/ProductsContextProvider";
import Loading from "../Loading";
import axios from "axios";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { categories } = useContext(ProductsContext);
  //   console.log(categories);
  //   const {  } = useContext(ProductsContext);
  const [categoryofProducts, setCategoryofProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://dummyjson.com/products/category/${categoryName}`)
      .then((res) => setCategoryofProducts(res.data.products));
    setLoading(false);
  }, [categoryName]);

  if (loading || !categoryofProducts) {
    return <Loading />;
  }

  return (
    <div>
      <div>
        {categories.some((item) => item == categoryName) ? (
          ""
        ) : (
          <h2 className="capitalize font-medium text-4xl text-center mt-4 text-pink-500">
            {categoryName.replace("-", " ")}
          </h2>
        )}
      </div>
      <SlidProduct product={categoryofProducts} />
    </div>
  );
};

export default CategoryPage;
