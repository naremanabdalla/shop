import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css/scrollbar";

const ProductImg = ({ item }) => {
  return (
    <Swiper
      modules={[Scrollbar]}
      scrollbar={{
        draggable: true,
        dragSize: 60,
        hide: false,
      }}
      fadeEffect={{
        crossFade: true, // Enable smooth cross-fade between slides
      }}
      style={{
        "--swiper-scrollbar-border-radius": "4px",
        "--swiper-scrollbar-bottom": "10px",
        "--swiper-scrollbar-drag-bg-color": "#3b82f6",
        "--swiper-scrollbar-size": "6px",
      }}
      className=" w-1/2 !ml-0 !mr-0 "
    >
      {item.images.map((image, index) => (
        <div key={`${image}-${index}`} className="mb-4">
          <SwiperSlide key={`${image}-${index}`} className="m-0">
            <div className=" rounded-md  pb-3 relative hover:border-blue-300">
              <img
                src={image}
                className="w-full object-contain rounded-lg  h-100"
              />
              <div className="bg-gray-200 animate-ping"></div>
            </div>
          </SwiperSlide>
        </div>
      ))}{" "}
    </Swiper>
  );
};

export default ProductImg;
