import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const HeroSlider = () => {
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
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex flex-col justify-center items-start p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 text-gray-800  bg-opacity-30">
              <h4 className="uppercase font-medium text-xs sm:text-sm md:text-base lg:text-lg mb-1 sm:mb-2">
                Introducing the new
              </h4>
              <h3 className="capitalize text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-pink-500 mb-2 sm:mb-4">
                Microsoft Xbox <br /> 360Controller
              </h3>
              <p className="text-xs sm:text-sm md:text-base mb-3 sm:mb-6">
                Windows Xp/10/7/8 Ps3, Tv Box
              </p>
              <Link to="/">
                <button className="px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 text-xs sm:text-sm md:text-base rounded-3xl border border-pink-500 bg-pink-500 text-white hover:bg-white hover:text-pink-500 transition-colors duration-300">
                  Shop Now
                </button>
              </Link>
            </div>
            <img
              src="/banner_Hero2.jpg"
              alt="slider hero 2"
              className="w-full h-auto object-cover object-[60%_75%] object-[60%_75%]"
              style={{ minHeight: "300px", maxHeight: "600px" }}
            />
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex flex-col justify-center items-start p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 text-gray-800  bg-opacity-30">
              <h4 className="uppercase font-medium text-xs sm:text-sm md:text-base lg:text-lg mb-1 sm:mb-2">
                Introducing the new
              </h4>
              <h3 className="capitalize text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-pink-500 mb-2 sm:mb-4">
                Microsoft Xbox <br /> 360Controller
              </h3>
              <p className="text-xs sm:text-sm md:text-base mb-3 sm:mb-6">
                Windows Xp/10/7/8 Ps3, Tv Box
              </p>
              <Link to="/">
                <button className="px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 text-xs sm:text-sm md:text-base rounded-3xl border border-pink-500 bg-pink-500 text-white hover:bg-white hover:text-pink-500 transition-colors duration-300">
                  Shop Now
                </button>
              </Link>
            </div>
            <img
              src="/banner_Hero3.jpg"
              alt="slider hero 3"
              className="w-full h-auto object-cover object-[60%_75%]"
              style={{ minHeight: "300px", maxHeight: "600px" }}
            />
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide>
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex flex-col justify-center items-start p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 text-gray-800  bg-opacity-30">
              <h4 className="uppercase font-medium text-xs sm:text-sm md:text-base lg:text-lg mb-1 sm:mb-2">
                Introducing the new
              </h4>
              <h3 className="capitalize text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-pink-500 mb-2 sm:mb-4">
                Microsoft Xbox <br /> 360Controller
              </h3>
              <p className="text-xs sm:text-sm md:text-base mb-3 sm:mb-6">
                Windows Xp/10/7/8 Ps3, Tv Box
              </p>
              <Link to="/">
                <button className="px-3 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2 text-xs sm:text-sm md:text-base rounded-3xl border border-pink-500 bg-pink-500 text-gray-800 hover:bg-white hover:text-pink-500 transition-colors duration-300">
                  Shop Now
                </button>
              </Link>
            </div>
            <img
              src="/banner_Hero1.jpg"
              alt="slider hero 1"
              className="w-full h-auto object-cover object-[60%_75%]"
              style={{ minHeight: "300px", maxHeight: "600px" }}
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroSlider;
