import Image from 'next/image'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css';

import 'swiper/css/navigation';
import 'swiper/css/pagination';


export default function Swiper1() {
  return <>
  <section className="px-20 py-10 bg-gradient-to-b from-green-50 to-green-100">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg"
        >
          <SwiperSlide>
            <div className="relative w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1605825473282-8de5b8d35537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                alt="Plant 1"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-center text-white p-4">
                <h1 className="text-6xl font-extrabold mb-4 animate-fadeInUp">
                  LET'S MAKE A{" "}
                  <span className="text-green-400">BETTER PLANET</span>
                </h1>
                <p className="text-xl mb-6 animate-fadeInUp delay-200">
                  Discover our range of trendy and affordable plants.
                </p>
                <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition duration-300 animate-fadeInUp delay-400">
                  SHOP NOW
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
  </>
}
