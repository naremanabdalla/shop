import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeroSlider = () => {
  const { t } = useTranslation();

  const slides = [
    {
      id: 1,
      head: "NEW ARRIVALS",
      contnt: "Luxury Skincare Collection",
      bottom: "Get 20% off on all premium creams & serums",
      img: "/img/skincare2.jpg",
      imgAlt: "luxury skincare products",
    },
    {
      id: 2,
      head: "TIMELESS ELEGANCE",
      contnt: "Premium Watches Collection",
      bottom: "Free shipping on orders over $100",
      img: "/img/watch1.jpg",
      imgAlt: "luxury watches display",
    },
    {
      id: 3,
      head: "TECH ESSENTIALS",
      contnt: "Smartphones & Accessories",
      bottom: "Bundle deals available - Save up to 30%",
      img: "/img/hero2.webp",
      imgAlt: "smartphones and smartwatches",
    },
    {
      id: 4,
      head: "FASHION FAVORITES",
      contnt: "Summer Clothing Collection",
      bottom: "New styles added daily - Shop now!",
      img: "/img/clothes4.jpg", // Add appropriate image
      imgAlt: "fashion clothing collection",
    },
    {
      id: 5,
      head: "BEAUTY MUST-HAVES",
      contnt: "Professional Makeup Kits",
      bottom: "Complete your look with our premium selection",
      img: "/img/Makeup1.jpg", // Add appropriate image
      imgAlt: "makeup products display",
    },
  ];
  return (
    <div className="relative px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <Swiper
        loop={true}
        spaceBetween={16}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
        breakpoints={{
          // when window width is >= 640px
          640: {
            spaceBetween: 24,
          },
          // when window width is >= 1024px
          1024: {
            spaceBetween: 30,
          },
        }}
      >
        {/* Slide  */}
        {slides.map((item) => (
          <SwiperSlide>
            <div className=" h-90 w-full ">
              <div className="relative ">
                <div className="text-white z-10 absolute inset-0 flex flex-col justify-start items-center p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 text-gray-800  bg-opacity-30">
                  <h4 className="uppercase font-medium text-xs sm:text-sm md:text-base lg:text-lg mb-1 sm:mb-2">
                    {item.head}
                  </h4>
                  <h3 className="capitalize text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[color:var(--color-primary)] mb-2 sm:mb-4">
                    {item.contnt}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base mb-3 sm:mb-6">
                    {item.bottom}
                  </p>
                  <Link to="/">
                    <button
                      className="px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 text-xs sm:text-sm md:text-base rounded-3xl border border-[color:var(--color-primary)] bg-[color:var(--color-primary)] 
                  text-white hover:bg-[color:var(--color-secondary)] hover:text-[color:var(--color-primary)] transition-colors duration-300"
                    >
                      {t("Shop Now")}
                    </button>
                  </Link>
                </div>

                <img
                  src={`${item.img}`}
                  alt={`${item.imgAlt}`}
                  className="w-full h-auto object-cover  brightness-50 object-bottom"
                  style={{ minHeight: "300px", maxHeight: "600px" }}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
