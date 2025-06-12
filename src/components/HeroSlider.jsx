import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
const HeroSlider = () => {
  return (
    <>
      <div className="px-20 relative">
        <Swiper
          loop={true}
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper  "
        >
          <SwiperSlide className="">
            <div className="absolute top-1/4 left-1/8 2xl:left-1/4">
              <h4 className="uppercase font-medium text-xs md:text-sm lg:text-lg">
                Introducing the new{" "}
              </h4>
              <h3 className="capitalize text-md md:text-2xl  lg:text-5xl font-bold text-pink-500 lg:mt-2">
                Microsoft Xbox <br /> 360Controller
              </h3>
              <p className="my-1 lg:my-8  text-md">
                Windows Xp/10/7/8 Ps3, Tv Box
              </p>
              <Link to="/">
                {" "}
                <button className="px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-base rounded-3xl border border-pink-500 bg-pink-500 text-white hover:bg-white hover:text-pink-500 transition-colors duration-300">
                  Shop Now
                </button>
              </Link>
            </div>
            <img
              src="/banner_Hero2.jpg"
              alt="slider hero 2"
              className="m-auto"
            />
          </SwiperSlide>
          <SwiperSlide className="">
            <div className="absolute top-1/4 left-1/8 ">
              <h4 className="uppercase font-medium text-xs md:text-sm lg:text-lg">
                Introducing the new{" "}
              </h4>
              <h3 className="capitalize text-md md:text-2xl  lg:text-5xl font-bold text-pink-500 lg:mt-2">
                Microsoft Xbox <br /> 360Controller
              </h3>
              <p className="my-1 lg:my-8 text-md">
                Windows Xp/10/7/8 Ps3, Tv Box
              </p>
              <Link to="/">
                {" "}
                <button className="px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-base rounded-3xl border border-pink-500 bg-pink-500 text-white hover:bg-white hover:text-pink-500 transition-colors duration-300">
                  Shop Now
                </button>
              </Link>
            </div>
            <img
              src="/banner_Hero3.jpg"
              alt="slider hero 3"
              className="m-auto"
            />
          </SwiperSlide>
          <SwiperSlide className="">
            <div className="absolute top-1/4 left-1/8 ">
              <h4 className="uppercase font-medium text-xs md:text-sm lg:text-lg">
                Introducing the new{" "}
              </h4>
              <h3 className="capitalize text-md md:text-2xl  lg:text-5xl font-bold text-pink-500 lg:mt-2">
                Microsoft Xbox <br /> 360Controller
              </h3>
              <p className="my-1 lg:my-8 text-md">
                Windows Xp/10/7/8 Ps3, Tv Box
              </p>
              <Link to="/">
                {" "}
                <button className="px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-base rounded-3xl border border-pink-500 bg-pink-500 text-white hover:bg-white hover:text-pink-500 transition-colors duration-300">
                  Shop Now
                </button>
              </Link>
            </div>

            <img
              src="/banner_Hero1.jpg"
              alt="slider hero 1"
              className="m-auto"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
};

export default HeroSlider;
