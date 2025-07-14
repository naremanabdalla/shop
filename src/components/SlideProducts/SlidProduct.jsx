import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination, Navigation } from "swiper/modules";
import ProductCard from "./ProductCard";
import { ProductsContext } from "../../Context/ProductsContextProvider";
const SlidProduct = ({ product }) => {
  const { categories } = useContext(ProductsContext);

  const [category, setCategory] = useState("");

  useEffect(() => {
    product.map((item) => {
      setCategory(item.category);
    });
  }, []);
  return (
    <>
      <div>
        <div>
          <h2 className="capitalize font-medium text-4xl text-center mt-4 text-pink-500 pb-10">
            {categories.map((item) =>
              item === category ? item.replace("-", " ") : ""
            )}
          </h2>
        </div>

        <div className="p-10 px-20 ">
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper [--swiper-navigation-color:theme(colors.pink.500)]"
          >
            {product.map((item) => {
              return (
                <SwiperSlide key={item.id}>
                  <ProductCard item={item} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default SlidProduct;
